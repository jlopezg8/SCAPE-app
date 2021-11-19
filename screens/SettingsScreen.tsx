import React from 'react';
import { Portal } from 'react-native-paper';

import serverURL from '../api/serverURL';
import { Surface } from '../components/containers';
import { PromptDialog } from '../components/dialogs';
import { ListItem } from '../components/misc';
import useVisible from '../hooks/useVisible';
import {
  createValidator,
  string as yupString
} from '../models/utils/localeYup';

/**
 * @requires react-native-paper.Provider for the Material Design components
 * ../api/serverURL can be mocked
 */
export default function SettingsScreen() {
  const serverURLPrompt = useVisible();
  return (
    <Surface>
      <ListItem
        title="URL del servidor"
        description={serverURL.get()}
        onPress={serverURLPrompt.open}
      />
      <Portal>
        <PromptDialog
          self={serverURLPrompt}
          label="URL del servidor"
          initialValue={serverURL.get()}
          submit={serverURL.set}
          validate={createValidator(yupString().url())}
        />
      </Portal>
    </Surface>
  );
}
