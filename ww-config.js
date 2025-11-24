export default {
editor: {
label: {
en: 'Multi-Select with Confirm',
},
icon: 'collection',
},
properties: {
initialValue: {
label: {
en: 'Initial value',
},
type: 'Array',
section: 'settings',
bindable: true,
defaultValue: [],
options: {
expandable: true,
getItemLabel(item) {
return item.label || item.value || 'Option';
},
item: {
type: 'Object',
defaultValue: {
label: 'Option',
value: '',
},
options: {
item: {
label: {
label: 'Label',
type: 'Text',
options: { placeholder: 'Option label' },
},
value: {
label: 'Value',
type: 'Text',
options: { placeholder: 'Option value' },
},
},
},
},
},
/* wwEditor:start */
bindingValidation: {
type: 'array',
tooltip: 'Bind to an array of objects with label and value properties: `[{label: "Option 1", value: "option1"}, ...]`',
},
propertyHelp: {
tooltip: 'The initially selected options when the component loads',
},
/* wwEditor:end */
},
options: {
label: {
en: 'Options',
},
type: 'Array',
section: 'settings',
bindable: true,
defaultValue: [
{ label: 'AFATEK', value: 'afatek' },
{ label: 'ALTITUDE SECURITE', value: 'altitude_securite' },
{ label: '2FA', value: '2fa' },
{ label: '3A ETANCHEITE', value: '3a_etancheite' },
{ label: 'ARENCO', value: 'arenco' },
{ label: 'ASSA ABLOY', value: 'assa_abloy' },
],
options: {
expandable: true,
getItemLabel(item) {
return item.label || item.value || 'Option';
},
item: {
type: 'Object',
defaultValue: {
label: 'Option',
value: '',
},
options: {
item: {
label: {
label: 'Label',
type: 'Text',
options: { placeholder: 'Option label' },
},
value: {
label: 'Value',
type: 'Text',
options: { placeholder: 'Option value' },
},
},
},
},
},
/* wwEditor:start */
bindingValidation: {
type: 'array',
tooltip: 'Bind to an array of objects with label and value properties: `[{label: "Option 1", value: "option1"}, ...]`',
},
propertyHelp: {
tooltip: 'The list of options available for selection',
},
/* wwEditor:end */
},
labelPropertyPath: {
label: {
en: 'Label Field',
},
type: 'ObjectPropertyPath',
section: 'settings',
bindable: true,
options: content => ({
object: content.options?.[0] || {}
}),
defaultValue: 'label',
hidden: (content, sidepanelContent, boundProps) => !Array.isArray(content.options) || !content.options?.length || !boundProps.options,
/* wwEditor:start */
bindingValidation: {
type: 'string',
tooltip: 'Select which property from each option to use as the display label',
},
propertyHelp: {
tooltip: 'Choose which field from your options to display as the label',
},
/* wwEditor:end */
},
valuePropertyPath: {
label: {
en: 'Value Field',
},
type: 'ObjectPropertyPath',
section: 'settings',
bindable: true,
options: content => ({
object: content.options?.[0] || {}
}),
defaultValue: 'value',
hidden: (content, sidepanelContent, boundProps) => !Array.isArray(content.options) || !content.options?.length || !boundProps.options,
/* wwEditor:start */
bindingValidation: {
type: 'string',
tooltip: 'Select which property from each option to use as the actual value',
},
propertyHelp: {
tooltip: 'Choose which field from your options to use as the value',
},
/* wwEditor:end */
},
placeholder: {
label: {
en: 'Placeholder',
},
type: 'Text',
section: 'settings',
bindable: true,
defaultValue: 'Select options...',
/* wwEditor:start */
bindingValidation: {
type: 'string',
tooltip: 'A string that will be displayed when no options are selected: `"Select options..."`',
},
propertyHelp: {
tooltip: 'Text displayed when no options are selected',
},
/* wwEditor:end */
    },
showConfirmButton: {
    label: {
        en: 'Show Confirm Button',
    },
    type: 'OnOff',
    section: 'settings',
    bindable: true,
    defaultValue: true,
    /* wwEditor:start */
    bindingValidation: {
        type: 'boolean',
        tooltip: 'A boolean that defines whether the confirm button is displayed: `true | false`',
    },
    propertyHelp: {
        tooltip: 'Show or hide the confirm button in the dropdown.',
    },
    /* wwEditor:end */
},
maxVisibleTags: {
label: {
en: 'Max Visible Tags',
},
type: 'Number',
section: 'settings',
bindable: true,
defaultValue: 3,
options: {
min: 1,
max: 20,
step: 1,
},
/* wwEditor:start */
bindingValidation: {
type: 'number',
tooltip: 'Number of tags to show before collapsing: `3`, `5`, etc.',
},
propertyHelp: {
tooltip: 'Maximum number of selected tags to display before showing "+X more"',
},
/* wwEditor:end */
},
displayMode: {
label: {
en: 'Display Mode',
},
type: 'TextSelect',
section: 'settings',
bindable: true,
defaultValue: 'tags',
options: {
options: [
{ value: 'tags', label: 'Show Tags' },
{ value: 'compact', label: 'Compact Summary' },
{ value: 'auto', label: 'Auto (Smart)' },
],
},
/* wwEditor:start */
bindingValidation: {
type: 'string',
tooltip: 'Valid values: tags | compact | auto',
},
propertyHelp: {
tooltip: 'How to display selected options: individual tags, compact summary, or auto-switch based on count',
},
/* wwEditor:end */
},
compactThreshold: {
label: {
en: 'Compact Threshold',
},
type: 'Number',
section: 'settings',
bindable: true,
defaultValue: 10,
options: {
min: 2,
max: 50,
step: 1,
},
hidden: (content) => content?.displayMode !== 'auto',
/* wwEditor:start */
bindingValidation: {
type: 'number',
tooltip: 'Number of selections before switching to compact mode in auto display',
},
propertyHelp: {
tooltip: 'In auto mode, switch to compact summary when selection count exceeds this number',
},
/* wwEditor:end */
},
disabled: {
label: {
en: 'Disabled',
},
type: 'OnOff',
section: 'settings',
bindable: true,
defaultValue: false,
/* wwEditor:start */
bindingValidation: {
type: 'boolean',
tooltip: 'A boolean that defines whether the select is disabled: `true | false`',
},
propertyHelp: {
tooltip: 'Disable the component to prevent user interaction',
},
/* wwEditor:end */
},
borderRadius: {
label: {
en: 'Border Radius',
},
type: 'Length',
section: 'style',
bindable: true,
defaultValue: '4px',
/* wwEditor:start */
bindingValidation: {
type: 'string',
tooltip: 'Border radius for the component: `"4px"`, `"8px"`, etc.',
},
propertyHelp: {
tooltip: 'Controls the roundness of the component corners',
},
/* wwEditor:end */
},
borderColor: {
label: {
en: 'Border Color',
},
type: 'Color',
section: 'style',
bindable: true,
defaultValue: '#dddddd',
/* wwEditor:start */
bindingValidation: {
type: 'string',
tooltip: 'Color for the component border',
},
propertyHelp: {
tooltip: 'Sets the color of the component border',
},
/* wwEditor:end */
},
backgroundColor: {
label: {
en: 'Background Color',
},
type: 'Color',
section: 'style',
bindable: true,
defaultValue: '#ffffff',
/* wwEditor:start */
bindingValidation: {
type: 'string',
tooltip: 'Background color for the component',
},
propertyHelp: {
tooltip: 'Sets the background color of the component',
},
/* wwEditor:end */
},
tagBackgroundColor: {
label: {
en: 'Tag Background',
},
type: 'Color',
section: 'style',
bindable: true,
defaultValue: '#e9ecef',
/* wwEditor:start */
bindingValidation: {
type: 'string',
tooltip: 'Background color for the selected option tags',
},
propertyHelp: {
tooltip: 'Sets the background color of the selected option tags',
},
/* wwEditor:end */
},
textColor: {
label: {
en: 'Text Color',
},
type: 'Color',
section: 'style',
bindable: true,
defaultValue: '#000000',
/* wwEditor:start */
bindingValidation: {
type: 'string',
tooltip: 'Color for the component text',
},
propertyHelp: {
tooltip: 'Sets the color of the component text',
},
/* wwEditor:end */
},
optionTextColor: {
label: {
en: 'Option Text Color',
},
type: 'Color',
section: 'style',
bindable: true,
defaultValue: '#000000',
/* wwEditor:start */
bindingValidation: {
type: 'string',
tooltip: 'Color for the unselected dropdown options text',
},
propertyHelp: {
tooltip: 'Sets the color of the text for unselected options in the dropdown',
},
/* wwEditor:end */
},
tagTextColor: {
label: {
en: 'Tag Text Color',
},
type: 'Color',
section: 'style',
bindable: true,
defaultValue: '#000000',
/* wwEditor:start */
bindingValidation: {
type: 'string',
tooltip: 'Color for the selected option tags text',
},
propertyHelp: {
tooltip: 'Sets the color of the text for selected option tags',
},
/* wwEditor:end */
},
primaryColor: {
label: {
en: 'Primary Color',
},
type: 'Color',
section: 'style',
bindable: true,
defaultValue: '#007bff',
/* wwEditor:start */
bindingValidation: {
type: 'string',
tooltip: 'Primary color for buttons and selected items',
},
propertyHelp: {
tooltip: 'Sets the color for buttons and selected items',
},
/* wwEditor:end */
},
fontSize: {
label: {
en: 'Font Size',
},
type: 'Length',
section: 'style',
bindable: true,
defaultValue: '14px',
/* wwEditor:start */
bindingValidation: {
type: 'string',
tooltip: 'Font size for the component text: `"14px"`, `"1rem"`, etc.',
},
propertyHelp: {
tooltip: 'Controls the size of text in the component',
},
/* wwEditor:end */
},
fontFamily: {
label: {
en: 'Font Family',
},
type: 'FontFamily',
section: 'style',
bindable: true,
defaultValue: '',
/* wwEditor:start */
bindingValidation: {
type: 'string',
tooltip: 'Font family for the component text',
},
propertyHelp: {
tooltip: 'Sets the font family used throughout the component',
},
/* wwEditor:end */
},
},
triggerEvents: [
{
name: 'change',
label: { en: 'On change' },
event: { value: [] },
default: true,
},
{
name: 'confirm',
label: { en: 'On confirm' },
event: { value: [] },
},
{
name: 'select', // NOUVEL ÉVÉNEMENT
label: { en: 'On select' },
event: { value: [], selectedOption: null, action: 'add' },
},
{
name: 'clear',
label: { en: 'On clear all' },
event: { value: null },
},
{
name: 'remove',
label: { en: 'On option remove' },
event: { value: null },
},
{
name: 'selectAll',
label: { en: 'On select/unselect all' },
event: { value: true, selectedCount: 0 },
},
{
name: 'initValueChange',
label: { en: 'On init value change' },
event: { value: [] },
},
],
actions: [
{
action: 'setValue',
label: { en: 'Set value' },
args: [
{
name: 'value',
type: 'array',
label: { en: 'Value' },
},
],
},
{
action: 'clearValue',
label: { en: 'Clear value' },
},
{
action: 'selectAll',
label: { en: 'Select all options' },
},
{
action: 'unselectAll',
label: { en: 'Unselect all options' },
},
],
};
