type JSONPrimitive = string | number | boolean | null
type JSONValue = JSONPrimitive | JSONObject | JSONArray
type JSONObject = {[member: string]: JSONValue}
type JSONArray = Array<JSONValue>
