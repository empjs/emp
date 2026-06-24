import type {CreateProjectPlan, GeneratedFile} from './types'

export function createTemplateFiles(plan: Omit<CreateProjectPlan, 'files'>): GeneratedFile[] {
  return [
    {
      path: 'emp.intent.yaml',
      content: [
        `name: ${plan.rootName}`,
        `intent: ${JSON.stringify(plan.intent.raw)}`,
        'packageManager: pnpm',
        'apps:',
        ...plan.apps.map(
          app =>
            `  - name: ${app.name}\n    role: ${app.role}\n    framework: ${app.framework}\n    port: ${app.port}`,
        ),
        '',
      ].join('\n'),
    },
    {
      path: 'apps/host/emp.config.ts',
      content: '',
    },
    {
      path: 'apps/user/emp.config.ts',
      content: '',
    },
  ]
}
