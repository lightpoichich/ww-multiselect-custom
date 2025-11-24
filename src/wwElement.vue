<template>
<div class="multi-select-container" :class="{ 'is-open': isOpen }" :style="componentStyles">
<!-- Selected options display -->
<div 
class="multi-select-input" 
@click="toggleDropdown"
:class="{ 'is-disabled': content.disabled }"
>
<div class="selected-options" @click.stop="openDropdown">
<!-- Compact summary mode -->
<div v-if="shouldShowCompact" class="compact-summary">
<span class="summary-text">{{ compactSummaryText }}</span>
</div>

<!-- Tags mode -->
<template v-else>
<div
v-for="(option, index) in visibleTags"
:key="index"
class="selected-option"
>
<span class="option-label">{{ option.label }}</span>
<span
class="remove-option"
@click.stop="removeOption(option)"
>×</span>
</div>

<!-- "More" badge -->
<div
v-if="hasMoreTags"
class="selected-option more-badge"
:title="hiddenTagsTooltip"
>
<span class="option-label">+{{ hiddenTagsCount }} more</span>
</div>
</template>

<input
v-if="!content.disabled"
ref="searchInput"
type="text"
class="search-input"
v-model="searchQuery"
@click.stop="openDropdown"
@input="onSearchInput"
@focus="openDropdown"
:placeholder="placeholderText"
/>
</div>
<div class="select-actions">
<span 
v-if="selectedOptions.length > 0" 
class="clear-all" 
@click.stop="clearAllOptions"
>
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
<line x1="18" y1="6" x2="6" y2="18"></line>
<line x1="6" y1="6" x2="18" y2="18"></line>
</svg>
</span>
<span class="dropdown-arrow" :class="{ 'is-open': isOpen }">
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
<polyline points="6 9 12 15 18 9"></polyline>
</svg>
</span>
</div>
</div>

<!-- Dropdown options -->
<div v-if="isOpen" class="dropdown-container">
<div class="select-all-container">
<div 
class="dropdown-option select-all-option" 
@click.stop="toggleSelectAll"
>
<div class="option-checkbox">
<div v-if="allOptionsSelected" class="checkbox-checked"></div>
</div>
<span class="option-label">{{ allOptionsSelected ? 'Tout déselectionner' : 'Tout sélectionner' }}</span>
</div>
</div>
<div class="dropdown-options">
<div 
v-for="(option, index) in filteredOptions" 
:key="index"
class="dropdown-option"
:class="{ 'is-selected': isOptionSelected(option) }"
@click.stop="toggleOption(option)"
>
<div class="option-checkbox">
<div v-if="isOptionSelected(option)" class="checkbox-checked"></div>
</div>
<span class="option-label">{{ option.label }}</span>
</div>
<div v-if="filteredOptions.length === 0" class="no-results">
Pas d'options disponibles...
</div>
</div>
<div class="dropdown-actions" v-if="content.showConfirmButton">
    <button 
        class="confirm-button" 
        @click.stop="confirmSelection"
    >
        Confirmer
    </button>
</div>
</div>
</div>
</template>

<script>
import { ref, computed, watch, onBeforeUnmount } from 'vue';

export default {
props: {
content: { 
type: Object, 
required: true 
},
uid: { 
type: String, 
required: true 
},
/* wwEditor:start */
wwEditorState: { type: Object, required: true },
/* wwEditor:end */
},
emits: ['trigger-event'],
setup(props, { emit }) {
// Editor state
const isEditing = computed(() => {
/* wwEditor:start */
return props.wwEditorState?.isEditing;
/* wwEditor:end */
// eslint-disable-next-line no-unreachable
return false;
});

// Generate a unique ID for this component instance
const instanceId = ref(`multi-select-${props.uid}`);

// Component state
const isOpen = ref(false);
const searchQuery = ref('');
const tempSelectedOptions = ref([]);
const searchInput = ref(null);

// Internal variable for the component value
const { value: selectedValue, setValue: setSelectedValue } = wwLib.wwVariable.useComponentVariable({
uid: props.uid,
name: 'value',
type: 'array',
defaultValue: computed(() => props.content?.initialValue || []),
});

// Computed properties
const options = computed(() => {
const rawOptions = props.content?.options || [];
const labelPath = props.content?.labelPropertyPath || 'label';
const valuePath = props.content?.valuePropertyPath || 'value';

// Map raw options to the expected format with label and value properties
return rawOptions.map(option => {
// Get label and value using the specified property paths
const label = wwLib.wwUtils.resolveObjectPropertyPath(option, labelPath) || '';
const value = wwLib.wwUtils.resolveObjectPropertyPath(option, valuePath) || '';

return {
// Original option data is preserved
...option,
// Ensure label and value properties exist for component functionality
label: String(label),
value: String(value)
};
});
});

const selectedOptions = computed(() => {
// Ensure we have valid options by filtering against the current options list
const currentOptions = options.value || [];
const currentSelectedValue = selectedValue.value || [];

// Filter out any selected values that don't exist in the current options
// This prevents issues when options change but selected values reference old options
return currentSelectedValue.filter(selected => {
const selectedValue = selected?.value;
// Keep only selected options that exist in the current options list
return selectedValue && currentOptions.some(option => option.value === selectedValue);
});
});

const filteredOptions = computed(() => {
if (!searchQuery.value) {
return options.value || [];
}

const query = searchQuery.value.toLowerCase();
return (options.value || []).filter(option => 
option.label?.toLowerCase().includes(query)
);
});

const placeholderText = computed(() => {
if (selectedOptions.value.length > 0) {
return '';
}
return props.content?.placeholder || 'Select options...';
});

// Display mode computed properties
const displayMode = computed(() => props.content?.displayMode || 'tags');
const maxVisibleTags = computed(() => props.content?.maxVisibleTags || 3);
const compactThreshold = computed(() => props.content?.compactThreshold || 10);

const shouldShowCompact = computed(() => {
const count = selectedOptions.value.length;
if (displayMode.value === 'compact') return count > 0;
if (displayMode.value === 'auto') return count >= compactThreshold.value;
return false;
});

const visibleTags = computed(() => {
if (shouldShowCompact.value) return [];
const max = maxVisibleTags.value;
return selectedOptions.value.slice(0, max);
});

const hasMoreTags = computed(() => {
if (shouldShowCompact.value) return false;
return selectedOptions.value.length > maxVisibleTags.value;
});

const hiddenTagsCount = computed(() => {
if (shouldShowCompact.value) return 0;
return Math.max(0, selectedOptions.value.length - maxVisibleTags.value);
});

const hiddenTagsTooltip = computed(() => {
if (!hasMoreTags.value) return '';
const hiddenTags = selectedOptions.value.slice(maxVisibleTags.value);
return hiddenTags.map(tag => tag.label).join(', ');
});

const compactSummaryText = computed(() => {
const count = selectedOptions.value.length;
if (count === 0) return '';
if (count === 1) return '1 option selected';
return `${count} options selected`;
});

// Add these computed properties after the placeholderText computed property
const componentStyles = computed(() => {
return {
'--border-radius': props.content?.borderRadius || '4px',
'--border-color': props.content?.borderColor || '#ddd',
'--background-color': props.content?.backgroundColor || '#fff',
'--tag-background-color': props.content?.tagBackgroundColor || '#e9ecef',
'--text-color': props.content?.textColor || '#000',
'--option-text-color': props.content?.optionTextColor || props.content?.textColor || '#000',
'--tag-text-color': props.content?.tagTextColor || props.content?.textColor || '#000',
'--primary-color': props.content?.primaryColor || '#007bff',
'--font-size': props.content?.fontSize || '14px',
'--font-family': props.content?.fontFamily || '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
};
});

// New computed property to check if all options are selected
const allOptionsSelected = computed(() => {
const currentOptions = filteredOptions.value || [];
if (currentOptions.length === 0) return false;

return currentOptions.every(option => 
tempSelectedOptions.value.some(selected => selected.value === option.value)
);
});

// Methods
const toggleDropdown = () => {
if (isEditing.value || props.content?.disabled) return;

if (!isOpen.value) {
openDropdown();
} else {
closeDropdown();
}
};

const openDropdown = () => {
if (isEditing.value || props.content?.disabled) return;

isOpen.value = true;
tempSelectedOptions.value = [...selectedOptions.value];

// Dispatch global event to notify other instances
document.dispatchEvent(new CustomEvent('multi-select-opened', {
detail: { id: instanceId.value }
}));

// Focus search input when dropdown opens
setTimeout(() => {
if (searchInput.value) {
searchInput.value.focus();
}
}, 0);

// Add click outside listener
setTimeout(() => {
document.addEventListener('click', handleClickOutside);
}, 0);
};

const closeDropdown = () => {
isOpen.value = false;
searchQuery.value = '';
document.removeEventListener('click', handleClickOutside);
};

const handleClickOutside = (event) => {
const container = document.querySelector('.multi-select-container');
if (container && !container.contains(event.target)) {
// Reset to previous selection if not confirmed
closeDropdown();
}
};

const handleGlobalDropdownEvent = (event) => {
// If this is a different instance opening, close this dropdown
if (event.detail.id !== instanceId.value && isOpen.value) {
closeDropdown();
}
};

const isOptionSelected = (option) => {
return tempSelectedOptions.value.some(item => item.value === option.value);
};

const toggleOption = (option) => {
if (isEditing.value) return;

const index = tempSelectedOptions.value.findIndex(item => item.value === option.value);
const isCurrentlySelected = index !== -1;

if (index === -1) {
tempSelectedOptions.value.push(option);
setSelectedValue([...tempSelectedOptions.value]);
emit('trigger-event', {
            name: 'select',
            event: { 
                value: [...tempSelectedOptions.value],
                selectedOption: option,
                action: 'add'
            }
        });
} else {
tempSelectedOptions.value.splice(index, 1);
setSelectedValue([...tempSelectedOptions.value]);
emit('trigger-event', {
            name: 'select',
            event: { 
                value: [...tempSelectedOptions.value], // Toute la sélection
                selectedOption: option,               // L'option qui vient d'être retirée
                action: 'remove'                     // Type d'action
            }
        });
}
};

// New method to toggle select all functionality
const toggleSelectAll = () => {
if (isEditing.value) return;

const currentOptions = filteredOptions.value || [];

if (allOptionsSelected.value) {
// If all are selected, unselect all filtered options
tempSelectedOptions.value = tempSelectedOptions.value.filter(selected => 
!currentOptions.some(option => option.value === selected.value)
);
} else {
// If not all selected, select all filtered options
// First, remove any existing filtered options to avoid duplicates
const nonFilteredOptions = tempSelectedOptions.value.filter(selected => 
!currentOptions.some(option => option.value === selected.value)
);

// Then add all filtered options
tempSelectedOptions.value = [...nonFilteredOptions, ...currentOptions];
}

// Emit select all event
emit('trigger-event', {
name: 'selectAll',
event: { 
value: allOptionsSelected.value,
selectedCount: tempSelectedOptions.value.length
}
});
};

const removeOption = (option) => {
if (isEditing.value) return;

const index = selectedOptions.value.findIndex(item => item.value === option.value);

if (index !== -1) {
const newSelection = [...selectedOptions.value];
newSelection.splice(index, 1);
setSelectedValue(newSelection);

emit('trigger-event', {
name: 'change',
event: { value: newSelection }
});

// Add new event emission for option removal
emit('trigger-event', {
name: 'remove',
event: { value: option }
});
}
};

const clearAllOptions = () => {
if (isEditing.value) return;

setSelectedValue([]);
tempSelectedOptions.value = [];

emit('trigger-event', {
name: 'change',
event: { value: [] }
});

emit('trigger-event', {
name: 'clear',
event: { value: null }
});
};

const confirmSelection = () => {
if (isEditing.value) return;

setSelectedValue([...tempSelectedOptions.value]);

emit('trigger-event', {
name: 'change',
event: { value: tempSelectedOptions.value }
});

emit('trigger-event', {
name: 'confirm',
event: { value: tempSelectedOptions.value }
});

closeDropdown();
};

const onSearchInput = () => {
// Open dropdown when typing
if (!isOpen.value) {
openDropdown();
}
};

// Action methods
const setValue = (value) => {
if (Array.isArray(value)) {
// Ensure all items in the value array have label and value properties
const validatedValue = value.filter(item => item && (item.label || item.value));

// Map values to ensure they have both label and value
const normalizedValue = validatedValue.map(item => {
// Try to find the matching option in the current options list
const matchingOption = options.value.find(opt => opt.value === (item.value || item.label));

if (matchingOption) {
// If we found a matching option, use its current label and value
return matchingOption;
} else {
// Otherwise, normalize the item
return {
label: item.label || item.value || '',
value: item.value || item.label || ''
};
}
});

setSelectedValue(normalizedValue);

emit('trigger-event', {
name: 'change',
event: { value: normalizedValue }
});
}
};

const clearValue = () => {
clearAllOptions();
};

// New action method to select all options
const selectAll = () => {
if (isEditing.value) return;

// Select all available options
const allOptions = options.value || [];
setSelectedValue([...allOptions]);

emit('trigger-event', {
name: 'change',
event: { value: allOptions }
});

emit('trigger-event', {
name: 'selectAll',
event: { 
value: true,
selectedCount: allOptions.length
}
});
};

// New action method to unselect all options
const unselectAll = () => {
clearAllOptions();

emit('trigger-event', {
name: 'selectAll',
event: { 
value: false,
selectedCount: 0
}
});
};

// Watch for initialValue changes
watch(() => props.content?.initialValue, (newValue) => {
if (newValue !== undefined && JSON.stringify(newValue) !== JSON.stringify(selectedValue.value)) {
// Validate and normalize the initial value
const validatedValue = Array.isArray(newValue) 
? newValue.filter(item => item && (item.label || item.value))
: [];

// Map values to ensure they have both label and value
const normalizedValue = validatedValue.map(item => {
// Try to find the matching option in the current options list
const matchingOption = options.value.find(opt => opt.value === (item.value || item.label));

if (matchingOption) {
// If we found a matching option, use its current label and value
return matchingOption;
} else {
// Otherwise, normalize the item
return {
label: item.label || item.value || '',
value: item.value || item.label || ''
};
}
});

setSelectedValue(normalizedValue);

emit('trigger-event', {
name: 'initValueChange',
event: { value: normalizedValue }
});
}
}, { deep: true });

// Watch for options changes to update selected options if needed
watch(() => props.content?.options, () => {
// When options change, we need to ensure selected values still exist in options
// This is handled by the selectedOptions computed property
// We just need to update the internal value to match
setSelectedValue([...selectedOptions.value]);
}, { deep: true });

// Watch for property path changes
watch(
[
() => props.content?.labelPropertyPath,
() => props.content?.valuePropertyPath
],
() => {
// When property paths change, we need to update the selected values
// to use the new label and value paths
if (selectedValue.value?.length) {
// Find matching options with the new paths
const updatedSelection = selectedValue.value.map(selected => {
// Try to find the matching option in the current options list
const matchingOption = options.value.find(opt => opt.value === selected.value);
return matchingOption || selected;
});

setSelectedValue(updatedSelection);
}
}
);

// Add global event listener for multi-select coordination
document.addEventListener('multi-select-opened', handleGlobalDropdownEvent);

// Cleanup
onBeforeUnmount(() => {
document.removeEventListener('click', handleClickOutside);
document.removeEventListener('multi-select-opened', handleGlobalDropdownEvent);
});

return {
isOpen,
searchQuery,
selectedOptions,
tempSelectedOptions,
filteredOptions,
placeholderText,
searchInput,
componentStyles,
instanceId,
allOptionsSelected,
toggleDropdown,
openDropdown,
isOptionSelected,
toggleOption,
toggleSelectAll,
removeOption,
clearAllOptions,
confirmSelection,
onSearchInput,
setValue,
clearValue,
selectAll,
unselectAll
};
}
};
</script>

<style lang="scss" scoped>
.multi-select-container {
position: relative;
width: 100%;
font-family: var(--font-family);
font-size: var(--font-size);
color: var(--text-color);
}

.multi-select-input {
display: flex;
align-items: center;
justify-content: space-between;
min-height: 40px;
padding: 4px 8px;
border: 1px solid var(--border-color);
border-radius: var(--border-radius);
background-color: var(--background-color);
cursor: pointer;

&.is-disabled {
background-color: #f5f5f5;
cursor: not-allowed;
}
}

.selected-options {
display: flex;
flex-wrap: wrap;
gap: 4px;
flex: 1;
min-width: 0;
}

.selected-option {
display: flex;
align-items: center;
background-color: var(--tag-background-color);
color: var(--tag-text-color);
border-radius: calc(var(--border-radius) * 0.75);
padding: 2px 8px;
margin: 2px 0;
white-space: nowrap;
}

.option-label {
max-width: 200px;
overflow: hidden;
text-overflow: ellipsis;
}

.remove-option {
margin-left: 4px;
font-weight: bold;
cursor: pointer;

&:hover {
color: #dc3545;
}
}

// Compact summary styling
.compact-summary {
display: flex;
align-items: center;
padding: 4px 0;
margin: 2px 0;
}

.summary-text {
color: var(--tag-text-color);
font-weight: 500;
white-space: nowrap;
}

// More badge styling
.more-badge {
background-color: var(--primary-color);
color: white;
cursor: default;
font-weight: 500;

.option-label {
font-size: 0.95em;
}

&:hover {
opacity: 0.9;
}
}

.search-input {
flex: 1;
min-width: 50px;
border: none;
outline: none;
background: transparent;
padding: 4px;
margin: 2px 0;
color: var(--text-color);
font-size: var(--font-size);
cursor: text;
}

.select-actions {
display: flex;
align-items: center;
}

.clear-all {
margin-right: 8px;
cursor: pointer;
color: #6c757d;

&:hover {
color: #dc3545;
}
}

.dropdown-arrow {
transition: transform 0.2s ease;
color: var(--text-color);

&.is-open {
transform: rotate(180deg);
}
}

.dropdown-container {
position: absolute;
top: 100%;
left: 0;
right: 0;
margin-top: 4px;
background-color: var(--background-color);
border: 1px solid var(--border-color);
border-radius: var(--border-radius);
box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
z-index: 1000;
max-height: 300px;
display: flex;
flex-direction: column;
overflow: hidden; /* Add this to contain child elements */
}

.select-all-container {
border-bottom: 1px solid var(--border-color);
}

.select-all-option {
font-weight: 500;
}

.dropdown-options {
overflow-y: auto; /* Make this section scrollable */
max-height: 220px; /* Limit height to allow space for header and footer */
}

.dropdown-option {
display: flex;
align-items: center;
padding: 8px 12px;
cursor: pointer;
color: var(--option-text-color);

&:hover {
background-color: rgba(0, 0, 0, 0.05);
}

&.is-selected {
background-color: var(--tag-background-color);
color: var(--tag-text-color);
}
}

.option-checkbox {
width: 16px;
height: 16px;
border: 1px solid #adb5bd;
border-radius: calc(var(--border-radius) * 0.5);
margin-right: 8px;
display: flex;
align-items: center;
justify-content: center;
}

.checkbox-checked {
width: 10px;
height: 10px;
background-color: var(--primary-color);
border-radius: calc(var(--border-radius) * 0.25);
}

.no-results {
padding: 12px;
text-align: center;
color: #6c757d;
}

.dropdown-actions {
padding: 8px;
border-top: 1px solid var(--border-color);
display: flex;
justify-content: flex-end;
}

.confirm-button {
padding: 6px 12px;
background-color: var(--primary-color);
color: white;
border: none;
border-radius: var(--border-radius);
cursor: pointer;
font-weight: 500;
font-size: var(--font-size);

&:hover {
opacity: 0.9;
}
}
</style>
