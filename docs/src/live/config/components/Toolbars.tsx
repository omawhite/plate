import 'tippy.js/animations/scale.css';
import 'tippy.js/dist/tippy.css';
import React, { ReactNode, useCallback, useEffect, useState } from 'react';
import { CodeAlt } from '@styled-icons/boxicons-regular/CodeAlt';
import { CodeBlock } from '@styled-icons/boxicons-regular/CodeBlock';
import { Highlight } from '@styled-icons/boxicons-regular/Highlight';
import { Subscript } from '@styled-icons/foundation/Subscript';
import { Superscript } from '@styled-icons/foundation/Superscript';
import { BorderAll } from '@styled-icons/material/BorderAll';
import { BorderBottom } from '@styled-icons/material/BorderBottom';
import { BorderClear } from '@styled-icons/material/BorderClear';
import { BorderLeft } from '@styled-icons/material/BorderLeft';
import { BorderRight } from '@styled-icons/material/BorderRight';
import { BorderTop } from '@styled-icons/material/BorderTop';
import { FormatAlignCenter } from '@styled-icons/material/FormatAlignCenter';
import { FormatAlignJustify } from '@styled-icons/material/FormatAlignJustify';
import { FormatAlignLeft } from '@styled-icons/material/FormatAlignLeft';
import { FormatAlignRight } from '@styled-icons/material/FormatAlignRight';
import { FormatBold } from '@styled-icons/material/FormatBold';
import { FormatIndentDecrease } from '@styled-icons/material/FormatIndentDecrease';
import { FormatIndentIncrease } from '@styled-icons/material/FormatIndentIncrease';
import { FormatItalic } from '@styled-icons/material/FormatItalic';
import { FormatListBulleted } from '@styled-icons/material/FormatListBulleted';
import { FormatListNumbered } from '@styled-icons/material/FormatListNumbered';
import { FormatQuote } from '@styled-icons/material/FormatQuote';
import { FormatStrikethrough } from '@styled-icons/material/FormatStrikethrough';
import { FormatUnderlined } from '@styled-icons/material/FormatUnderlined';
import { Keyboard } from '@styled-icons/material/Keyboard';
import { Looks3 } from '@styled-icons/material/Looks3';
import { Looks4 } from '@styled-icons/material/Looks4';
import { Looks5 } from '@styled-icons/material/Looks5';
import { Looks6 } from '@styled-icons/material/Looks6';
import { LooksOne } from '@styled-icons/material/LooksOne';
import { LooksTwo } from '@styled-icons/material/LooksTwo';
import { TippyProps } from '@tippyjs/react';
import {
  addColumn,
  addRow,
  AlignToolbarButton,
  BalloonToolbar,
  BlockToolbarButton,
  CodeBlockToolbarButton,
  ColorPicker,
  ColorType,
  DEFAULT_COLORS,
  DEFAULT_CUSTOM_COLORS,
  deleteColumn,
  deleteRow,
  deleteTable,
  ELEMENT_BLOCKQUOTE,
  ELEMENT_CODE_BLOCK,
  ELEMENT_H1,
  ELEMENT_H2,
  ELEMENT_H3,
  ELEMENT_H4,
  ELEMENT_H5,
  ELEMENT_H6,
  ELEMENT_OL,
  ELEMENT_UL,
  getMark,
  getPlatePluginType,
  getPreventDefaultHandler,
  indent,
  insertTable,
  isListItemContentMarkActive,
  isMarkActive,
  ListToolbarButton,
  MARK_BOLD,
  MARK_CODE,
  MARK_COLOR,
  MARK_HIGHLIGHT,
  MARK_ITALIC,
  MARK_KBD,
  MARK_STRIKETHROUGH,
  MARK_SUBSCRIPT,
  MARK_SUPERSCRIPT,
  MARK_UNDERLINE,
  MarkToolbarButton,
  outdent,
  removeListItemContentMarkByMarkerSelection,
  removeMark,
  setListItemContentMarkByMarkerSelection,
  setMarks,
  TableToolbarButton,
  toggleMark,
  ToolbarButton,
  ToolbarButtonProps,
  ToolbarDropdown,
  useListItemMarkerSelection,
  usePlateEditorRef,
  usePlateEditorState,
  usePlateEventId,
} from '@udecode/plate';
import { ReactEditor } from 'slate-react';

export const BasicElementToolbarButtons = () => {
  const editor = usePlateEditorRef();

  return (
    <>
      <BlockToolbarButton
        type={getPlatePluginType(editor, ELEMENT_H1)}
        icon={<LooksOne />}
      />
      <BlockToolbarButton
        type={getPlatePluginType(editor, ELEMENT_H2)}
        icon={<LooksTwo />}
      />
      <BlockToolbarButton
        type={getPlatePluginType(editor, ELEMENT_H3)}
        icon={<Looks3 />}
      />
      <BlockToolbarButton
        type={getPlatePluginType(editor, ELEMENT_H4)}
        icon={<Looks4 />}
      />
      <BlockToolbarButton
        type={getPlatePluginType(editor, ELEMENT_H5)}
        icon={<Looks5 />}
      />
      <BlockToolbarButton
        type={getPlatePluginType(editor, ELEMENT_H6)}
        icon={<Looks6 />}
      />
      <BlockToolbarButton
        type={getPlatePluginType(editor, ELEMENT_BLOCKQUOTE)}
        icon={<FormatQuote />}
      />
      <CodeBlockToolbarButton
        type={getPlatePluginType(editor, ELEMENT_CODE_BLOCK)}
        icon={<CodeBlock />}
      />
    </>
  );
};

export const IndentToolbarButtons = () => {
  const editor = usePlateEditorRef();

  return (
    <>
      <ToolbarButton
        onMouseDown={editor && getPreventDefaultHandler(outdent, editor)}
        icon={<FormatIndentDecrease />}
      />
      <ToolbarButton
        onMouseDown={editor && getPreventDefaultHandler(indent, editor)}
        icon={<FormatIndentIncrease />}
      />
    </>
  );
};

export const ListToolbarButtons = () => {
  const editor = usePlateEditorRef();

  return (
    <>
      <ListToolbarButton
        type={getPlatePluginType(editor, ELEMENT_UL)}
        icon={<FormatListBulleted />}
      />
      <ListToolbarButton
        type={getPlatePluginType(editor, ELEMENT_OL)}
        icon={<FormatListNumbered />}
      />
    </>
  );
};

export const ListExtensionToolbarButtons = () => {
  const editor = usePlateEditorState(usePlateEventId('focus'));

  const ToggleMarkButton = ({
    type,
    clear,
    icon,
  }: {
    type: string;
    clear?: string;
  } & ToolbarButtonProps): JSX.Element => {
    const [licSelection] = useListItemMarkerSelection(editor?.id as string);

    const active =
      editor &&
      (licSelection
        ? isListItemContentMarkActive(editor, licSelection, type)
        : !!editor?.selection && isMarkActive(editor, type));

    return (
      <ToolbarButton
        active={active}
        onMouseDown={(event) => {
          event.preventDefault();
          if (!editor) {
            return;
          }

          if (licSelection) {
            setListItemContentMarkByMarkerSelection(
              editor,
              licSelection,
              type,
              !active
            );
          } else {
            !!editor?.selection && toggleMark(editor, type, clear);
          }
        }}
        icon={icon}
      />
    );
  };

  type ColorPickerToolbarDropdownProps = {
    pluginKey?: string;
    icon: ReactNode;
    selectedIcon: ReactNode;
    colors?: ColorType[];
    customColors?: ColorType[];
    closeOnSelect?: boolean;
  };

  const ColorPickerToolbarDropdown = ({
    pluginKey,
    icon,
    selectedIcon,
    colors = DEFAULT_COLORS,
    customColors = DEFAULT_CUSTOM_COLORS,
    closeOnSelect = true,
    ...rest
  }: ColorPickerToolbarDropdownProps & ToolbarButtonProps) => {
    const [open, setOpen] = useState(false);
    const editorRef = usePlateEditorRef();
    const type = getPlatePluginType(editorRef, pluginKey);
    const [licSelection] = useListItemMarkerSelection(editor?.id as string);

    const color =
      editorRef &&
      (licSelection
        ? isListItemContentMarkActive(editorRef, licSelection, type)
        : getMark(editorRef, type));

    const [selectedColor, setSelectedColor] = useState<string>();

    const onToggle = useCallback(() => {
      setOpen(!open);
    }, [open, setOpen]);

    const updateColor = useCallback(
      (value: string) => {
        if (editorRef && editor && (editor.selection || licSelection)) {
          setSelectedColor(value);

          if (licSelection) {
            setListItemContentMarkByMarkerSelection(
              editor,
              licSelection,
              type,
              value
            );
          } else {
            ReactEditor.focus(editorRef);

            setMarks(editor, { [type]: value });
          }
        }
      },
      [editorRef, licSelection, type]
    );

    const updateColorAndClose = useCallback(
      (value: string) => {
        updateColor(value);
        closeOnSelect && onToggle();
      },
      [closeOnSelect, onToggle, updateColor]
    );

    const clearColor = useCallback(() => {
      if (editorRef && editor && (editor.selection || licSelection)) {
        if (selectedColor) {
          if (licSelection) {
            removeListItemContentMarkByMarkerSelection(
              editor,
              type,
              licSelection
            );
          } else {
            ReactEditor.focus(editorRef);
            removeMark(editor, { key: type });
          }
        }

        closeOnSelect && onToggle();
      }
    }, [closeOnSelect, editorRef, licSelection, onToggle, selectedColor, type]);

    useEffect(() => {
      if (editor?.selection) {
        setSelectedColor(color);
      }
    }, [color]);

    return (
      <ToolbarDropdown
        control={
          <ToolbarButton
            active={!!editor?.selection && isMarkActive(editor, type)}
            icon={icon}
            {...rest}
          />
        }
        open={open}
        onOpen={onToggle}
        onClose={onToggle}
      >
        <ColorPicker
          color={selectedColor || color}
          colors={colors}
          customColors={customColors}
          selectedIcon={selectedIcon}
          updateColor={updateColorAndClose}
          updateCustomColor={updateColor}
          clearColor={clearColor}
        />
      </ToolbarDropdown>
    );
  };

  return (
    <>
      <ListToolbarButton
        type={getPlatePluginType(editor, ELEMENT_UL)}
        icon={<FormatListBulleted />}
      />
      <ListToolbarButton
        type={getPlatePluginType(editor, ELEMENT_OL)}
        icon={<FormatListNumbered />}
      />
      <ToggleMarkButton
        type={getPlatePluginType(editor, MARK_BOLD)}
        icon={<FormatBold />}
      />
      <ToggleMarkButton
        type={getPlatePluginType(editor, MARK_ITALIC)}
        icon={<FormatItalic />}
      />
      <ColorPickerToolbarDropdown
        pluginKey={MARK_COLOR}
        icon={<div>Color</div>}
        selectedIcon={<div>Selected</div>}
        tooltip={{ content: 'Text color' }}
      />
    </>
  );
};

export const AlignToolbarButtons = () => {
  return (
    <>
      <AlignToolbarButton value="left" icon={<FormatAlignLeft />} />
      <AlignToolbarButton value="center" icon={<FormatAlignCenter />} />
      <AlignToolbarButton value="right" icon={<FormatAlignRight />} />
      <AlignToolbarButton value="justify" icon={<FormatAlignJustify />} />
    </>
  );
};

export const BasicMarkToolbarButtons = () => {
  const editor = usePlateEditorRef();

  return (
    <>
      <MarkToolbarButton
        type={getPlatePluginType(editor, MARK_BOLD)}
        icon={<FormatBold />}
      />
      <MarkToolbarButton
        type={getPlatePluginType(editor, MARK_ITALIC)}
        icon={<FormatItalic />}
      />
      <MarkToolbarButton
        type={getPlatePluginType(editor, MARK_UNDERLINE)}
        icon={<FormatUnderlined />}
      />
      <MarkToolbarButton
        type={getPlatePluginType(editor, MARK_STRIKETHROUGH)}
        icon={<FormatStrikethrough />}
      />
      <MarkToolbarButton
        type={getPlatePluginType(editor, MARK_CODE)}
        icon={<CodeAlt />}
      />
      <MarkToolbarButton
        type={getPlatePluginType(editor, MARK_SUPERSCRIPT)}
        clear={getPlatePluginType(editor, MARK_SUBSCRIPT)}
        icon={<Superscript />}
      />
      <MarkToolbarButton
        type={getPlatePluginType(editor, MARK_SUBSCRIPT)}
        clear={getPlatePluginType(editor, MARK_SUPERSCRIPT)}
        icon={<Subscript />}
      />
    </>
  );
};

export const KbdToolbarButton = () => {
  const editor = usePlateEditorRef();

  return (
    <MarkToolbarButton
      type={getPlatePluginType(editor, MARK_KBD)}
      icon={<Keyboard />}
    />
  );
};

export const HighlightToolbarButton = () => {
  const editor = usePlateEditorRef();

  return (
    <MarkToolbarButton
      type={getPlatePluginType(editor, MARK_HIGHLIGHT)}
      icon={<Highlight />}
    />
  );
};

export const TableToolbarButtons = () => (
  <>
    <TableToolbarButton icon={<BorderAll />} transform={insertTable} />
    <TableToolbarButton icon={<BorderClear />} transform={deleteTable} />
    <TableToolbarButton icon={<BorderBottom />} transform={addRow} />
    <TableToolbarButton icon={<BorderTop />} transform={deleteRow} />
    <TableToolbarButton icon={<BorderLeft />} transform={addColumn} />
    <TableToolbarButton icon={<BorderRight />} transform={deleteColumn} />
  </>
);

export const MarkBallonToolbar = () => {
  const editor = usePlateEditorRef();

  const arrow = false;
  const theme = 'dark';
  const tooltip: TippyProps = {
    arrow: true,
    delay: 0,
    duration: [200, 0],
    hideOnClick: false,
    offset: [0, 17],
    placement: 'top',
  };

  return (
    <BalloonToolbar
      popperOptions={{
        placement: 'top',
      }}
      theme={theme}
      arrow={arrow}
    >
      <MarkToolbarButton
        type={getPlatePluginType(editor, MARK_BOLD)}
        icon={<FormatBold />}
        tooltip={{ content: 'Bold (⌘B)', ...tooltip }}
      />
      <MarkToolbarButton
        type={getPlatePluginType(editor, MARK_ITALIC)}
        icon={<FormatItalic />}
        tooltip={{ content: 'Italic (⌘I)', ...tooltip }}
      />
      <MarkToolbarButton
        type={getPlatePluginType(editor, MARK_UNDERLINE)}
        icon={<FormatUnderlined />}
        tooltip={{ content: 'Underline (⌘U)', ...tooltip }}
      />
    </BalloonToolbar>
  );
};
