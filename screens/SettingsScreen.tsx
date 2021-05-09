import React from 'react';
import { Portal } from 'react-native-paper';

import serverURL from '../api/serverURL';
import Prompt from '../components/Prompt';
import { ListItem, Surface } from '../components/styled';
import useVisible from '../hooks/useVisible';
import { createValidator, string as yupString } from '../models/utils/localeYup';

/**
 * @requires react-native-paper.Provider for the Material Design components
 * ../api/serverURL can be mocked
 */
export default function SettingsScreen() {
  const serverURLPrompt = useVisible();
  return (
    <Surface>
      <Portal>
        <Prompt
          visible={serverURLPrompt.visible}
          hideModal={serverURLPrompt.close}
          label="URL del servidor"
          initialValue={serverURL.get()}
          onSubmit={serverURL.set}
          validate={createValidator(yupString().url())}
        />
      </Portal>
      <ListItem
        title="URL del servidor"
        description={serverURL.get()}
        onPress={serverURLPrompt.open}
      />
    </Surface>
  );
}
