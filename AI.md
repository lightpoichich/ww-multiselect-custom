---
name: multi-select-confirm
description: A multi-select dropdown component with confirm button, select all functionality, and customizable styling for selecting multiple options
keywords: [select, dropdown, multi-select, options, confirm, clear, select-all, customizable, styling]
---

#### Multi-Select with Confirm

***Purpose:***
A flexible multi-select dropdown component that allows users to select multiple options with confirmation, including a select all feature for bulk selection.

***Features:***
- Select multiple options from a dropdown list
- Select/unselect all options with a single click
- Search functionality to filter available options
- Confirm button to validate selection changes
- Clear all button to remove all selected options
- Individual option removal with "×" button
- Selected options displayed as tags/chips
- Fully customizable styling to match your design system

***Properties:***
- `initialValue`: `Array` - The initially selected options when the component loads. Default: `[]`
- `options`: `Array` - The list of options available for selection. Each option should have properties that can be mapped to label and value. Default: `[{ label: 'AFATEK', value: 'afatek' }, ...]`
- `labelPropertyPath`: `string` - The property path to use for displaying option labels. Default: `'label'`
- `valuePropertyPath`: `string` - The property path to use for option values. Default: `'value'`
- `placeholder`: `string` - Text displayed when no options are selected. Default: `'Select options...'`
- `maxVisibleTags`: `number` - Maximum number of selected tags to display before showing "+X more" badge. Default: `3`
- `displayMode`: `string` - How to display selected options: 'tags' (show individual tags), 'compact' (show summary text), or 'auto' (automatically switch based on count). Default: `'tags'`
- `compactThreshold`: `number` - In auto mode, switch to compact summary when selection count exceeds this number. Default: `10`
- `disabled`: `boolean` - Disable the component to prevent user interaction. Default: `false`

***Styling Properties:***
- `borderRadius`: `string` - Controls the roundness of the component corners. Default: `'4px'`
- `borderColor`: `string` - Sets the color of the component border. Default: `'#dddddd'`
- `backgroundColor`: `string` - Sets the background color of the component. Default: `'#ffffff'`
- `tagBackgroundColor`: `string` - Sets the background color of the selected option tags. Default: `'#e9ecef'`
- `textColor`: `string` - Sets the color of the component text. Default: `'#000000'`
- `optionTextColor`: `string` - Sets the color of the unselected dropdown options text. Default: `'#000000'`
- `tagTextColor`: `string` - Sets the color of the selected option tags text. Default: `'#000000'`
- `primaryColor`: `string` - Sets the color for buttons and selected items. Default: `'#007bff'`
- `fontSize`: `string` - Controls the size of text in the component. Default: `'14px'`
- `fontFamily`: `string` - Sets the font family used throughout the component. Default: System fonts

***Events:***
- `change`: {value: Array} - Triggered when the selection changes (after confirming or removing individual options)
- `confirm`: {value: Array} - Triggered when the user clicks the confirm button to validate their selection
- `clear`: {value: null} - Triggered when the user clears all selected options
- `remove`: {value: Object} - Triggered when a specific option is removed from the selection
- `selectAll`: {value: boolean, selectedCount: number} - Triggered when the user selects or unselects all options
- `initValueChange`: {value: Array} - Triggered when the initial value changes externally

***Actions:***
- `setValue`: Set the selected options. Args: value (Array of option objects)
- `clearValue`: Clear all selected options
- `selectAll`: Select all available options
- `unselectAll`: Unselect all options

***Exposed Variables:***
- `value`: Array - The currently selected options (path: variables['current_element_uid-value'])

***Notes:***
- The "Select All" button toggles between selecting and unselecting all currently filtered options
- When searching, the "Select All" button will only affect the filtered options currently visible
- The component maintains proper synchronization between options and selected values when options change
- Dynamic property mapping allows you to use this component with various data structures
- **Display Modes**:
  - **Tags mode**: Shows individual tags up to `maxVisibleTags`, then displays "+X more" badge with tooltip
  - **Compact mode**: Always shows "X options selected" summary text
  - **Auto mode**: Automatically switches to compact summary when selection exceeds `compactThreshold`
- Hover over the "+X more" badge to see a tooltip with all hidden tag labels
