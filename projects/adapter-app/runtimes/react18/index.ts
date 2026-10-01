import React from 'react'
import ReactDOM from 'react-dom'
import {createRoot} from 'react-dom/client'
import {reactRuntime} from '../../src/lab/runtime-factory'

export default reactRuntime('react18', React, ReactDOM, createRoot)
