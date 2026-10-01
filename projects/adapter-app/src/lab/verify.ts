import {loadRuntime} from './registry'
import type {CheckResult, DemoEvent, DemoProps, FrameworkId} from './types'

async function until(check: () => boolean, message: string) {
  const start = performance.now()
  while (!check()) {
    if (performance.now() - start > 3000) throw new Error(message)
    await new Promise(resolve => setTimeout(resolve, 20))
  }
}

export async function verifyPair(hostId: FrameworkId, componentId: FrameworkId): Promise<CheckResult> {
  const events: DemoEvent[] = []
  const errors: Error[] = []
  const sandbox = document.createElement('div')
  sandbox.className = 'verification-sandbox'
  sandbox.setAttribute('aria-hidden', 'true')
  const first = document.createElement('div')
  const second = document.createElement('div')
  sandbox.append(first, second)
  document.body.append(sandbox)
  const drivers: {destroy: (dom: HTMLElement) => void; render: (dom: HTMLElement, props: DemoProps) => void}[] = []
  const assert = (value: boolean, message: string) => {
    if (!value) throw new Error(message)
  }
  const props = (id: string): DemoProps => ({
    name: '验收组件',
    step: 1,
    note: '可移除',
    instanceId: id,
    onChange: event => events.push(event),
    onLifecycle: event => events.push(event),
  })
  try {
    const [host, component] = await Promise.all([loadRuntime(hostId), loadRuntime(componentId)])
    const createHost = host.host(component.provider, error => errors.push(error))
    const one = createHost()
    const two = createHost()
    drivers.push(one, two)
    one.render(first, props('first'))
    two.render(second, props('second'))
    await until(() => events.filter(event => event.type === 'mounted').length === 2, '挂载或生命周期失败')
    assert(first.querySelector('[data-runtime]')?.getAttribute('data-runtime') === componentId, '组件框架不匹配')
    assert(first.querySelector('[data-host]')?.getAttribute('data-host') === hostId, '宿主框架不匹配')
    assert(
      first.textContent?.includes(component.version) === true && first.textContent.includes(host.version),
      '版本展示错误',
    )
    ;(first.querySelector('[data-increment]') as HTMLButtonElement).click()
    await until(() => first.querySelector('[data-count]')?.textContent === '1', '计数失败')
    assert(second.querySelector('[data-count]')?.textContent === '0', '多实例状态串扰')
    const updated = {...props('first'), name: 'Props 已更新', step: 3}
    delete updated.note
    // Replace the callback too; stale closures must not receive this event.
    const updatedEvents: DemoEvent[] = []
    updated.onChange = event => updatedEvents.push(event)
    one.render(first, updated)
    await until(
      () =>
        first.querySelector('[data-demo-name]')?.textContent === updated.name &&
        first.querySelector('[data-demo-note]')?.textContent === '未提供',
      'Props 更新或移除失败',
    )
    ;(first.querySelector('[data-increment]') as HTMLButtonElement).click()
    await until(() => first.querySelector('[data-count]')?.textContent === '4', '新步长或状态保持失败')
    assert(
      events.filter(event => event.type === 'countChanged').length === 1 &&
        updatedEvents.length === 1 &&
        updatedEvents[0].value === 4,
      '事件重复或回调未更新',
    )
    one.destroy(first)
    two.destroy(second)
    await until(() => events.filter(event => event.type === 'unmounted').length === 2, '卸载生命周期失败')
    assert(!first.querySelector('[data-runtime]') && !second.querySelector('[data-runtime]'), '卸载 DOM 残留')
    one.render(first, props('remounted'))
    await until(() => first.querySelector('[data-count]')?.textContent === '0', '重新挂载未重置状态')
    one.destroy(first)
    await until(() => events.filter(event => event.type === 'unmounted').length === 3, '重新挂载后卸载失败')
    assert(errors.length === 0, errors[0]?.message || 'Bridge 错误')
    return {status: 'passed', detail: '版本、Props 更新与移除、回调更新、多实例、卸载及重挂载通过'}
  } catch (error) {
    return {status: 'failed', detail: (error as Error).message}
  } finally {
    drivers.forEach((driver, index) => driver.destroy(index === 0 ? first : second))
    await new Promise(resolve => setTimeout(resolve, 30))
    sandbox.remove()
  }
}
