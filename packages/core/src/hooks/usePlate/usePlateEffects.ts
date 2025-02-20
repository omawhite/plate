import { useEffect } from 'react';
import { createEditor, Editor } from 'slate';
import { createHistoryPlugin } from '../../plugins/createHistoryPlugin';
import { createReactPlugin } from '../../plugins/createReactPlugin';
import { usePlateActions } from '../../stores/plate/plate.actions';
import { usePlateEditorRef } from '../../stores/plate/selectors/usePlateEditorRef';
import { usePlateEnabled } from '../../stores/plate/selectors/usePlateEnabled';
import { usePlatePlugins } from '../../stores/plate/selectors/usePlatePlugins';
import { UsePlateEffectsOptions } from '../../types/UsePlateEffectsOptions';
import { flatMapByKey } from '../../utils/flatMapByKey';
import { pipe } from '../../utils/pipe';
import { withPlate } from '../../utils/withPlate';

/**
 * Effects to update the plate store from the options.
 * Dynamically updating the options will update the store state.
 */
export const usePlateEffects = <T = {}>({
  id = 'main',
  value,
  editor,
  enabled = true,
  components,
  options,
  initialValue,
  normalizeInitialValue,
  plugins,
}: UsePlateEffectsOptions<T>) => {
  const {
    setInitialState,
    setValue,
    setEditor,
    setPlugins,
    setPluginKeys,
    setEnabled,
    clearState,
  } = usePlateActions(id);
  const storeEditor = usePlateEditorRef<T>(id);
  const storeEnabled = usePlateEnabled(id);
  const storePlugins = usePlatePlugins(id);

  // Clear the state on unmount.
  useEffect(
    () => () => {
      clearState();
    },
    [clearState, id]
  );

  useEffect(() => {
    setInitialState({
      enabled: true,
      plugins: [],
      pluginKeys: [],
      value: [],
    });
  }, [id, setInitialState]);

  // Slate.value
  useEffect(() => {
    initialValue && setValue(initialValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setValue]);

  // Slate.value
  useEffect(() => {
    value && setValue(value);

    !initialValue && !value && setValue([{ children: [{ text: '' }] }]);
  }, [initialValue, setValue, value]);

  useEffect(() => {
    setEnabled(enabled);
  }, [enabled, setEnabled]);

  // Plate plugins
  useEffect(() => {
    setPlugins(
      plugins ?? ([createReactPlugin(), createHistoryPlugin()] as any)
    );
  }, [plugins, setPlugins]);

  useEffect(() => {
    plugins && setPluginKeys(flatMapByKey(plugins, 'pluginKeys'));
  }, [plugins, setPluginKeys]);

  useEffect(() => {
    if (storeEditor && !storeEnabled) {
      setEditor(undefined);
    }
  }, [storeEnabled, storeEditor, setEditor]);

  // Slate.editor
  useEffect(() => {
    if (!storeEditor && storeEnabled) {
      setEditor(
        pipe(
          editor ?? (createEditor() as any),
          withPlate({
            id,
            plugins: storePlugins,
            options,
            components,
          })
        )
      );
    }
  }, [
    storeEditor,
    components,
    editor,
    id,
    options,
    plugins,
    storeEnabled,
    storePlugins,
    setEditor,
  ]);

  useEffect(() => {
    if (storeEditor && normalizeInitialValue) {
      Editor.normalize(storeEditor, { force: true });
    }
  }, [storeEditor, normalizeInitialValue]);
};
