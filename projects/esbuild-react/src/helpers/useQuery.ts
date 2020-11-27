import {useLocation} from 'react-router-dom'
/**
 * 使用方法
 * const query = useQuery()
 * query.get('lang')
 */
export function useQuery() {
  return new URLSearchParams(useLocation().search)
}
