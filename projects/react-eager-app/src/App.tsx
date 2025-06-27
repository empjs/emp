import React from 'react'
import RemoteApp from 'react_eger_host/App'
import ChannelBotttomBar from 'yybase/components/BottomBar/ChannelBottomBar'
import ChannelTree from 'yybase/components/ChannelTree'
import ChannelHeader from 'yybase/components/Header/ChannelHeader'
import MicrophonePanel from 'yybase/components/MicrophonePanel'
import Provider from 'yybase/store/Provider'
import ErrorBoundary from './ErrorBoundary'

//
const App = () => (
  <div>
    <h1> React {React.version} Eager App</h1>
    <RemoteApp />
    <ErrorBoundary>
      <Provider>
        <ChannelBotttomBar
          changeTemplateConfig={{
            text: '语聊模板',
            iconCmp: () => <></>,
          }}
          avatarCmp={() => <>avatar</>}
        />
      </Provider>

      <Provider>
        <ChannelTree />
      </Provider>

      <Provider>
        <ChannelHeader />
      </Provider>

      <Provider>
        <MicrophonePanel />
      </Provider>
    </ErrorBoundary>
  </div>
)

export default App
