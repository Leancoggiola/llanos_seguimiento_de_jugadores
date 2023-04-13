import { createContext } from "react";

export const ModalContext = createContext({ closeModal: null })

export const SelectContext = createContext()

export const FormFieldContext = createContext({
    disabled: false,
    formElementType: null,
    hasContent: false,
    hasPlaceholder: false,
    id: '',
    invalid: false,
    isActive: false,
    isFocused: false,
    required: false,
    value: '',
    setDisabled: function setDisabled() {
        return null
    },
    setFormElementType: function setFormElementType() {
        return null
    },
    setHasPlaceholder: function setHasPlaceholder() {
        return null
    },
    setHasContent: function setHasContent() {
        return null
    },
    setId: function setId() {
        return null
    },
    setInvalid: function setInvalid() {
        return null
    },
    setRequired: function setRequired() {
        return null
    },
    setValue: function setValue() {
        return null
    },
    toggleFocus: function toggleFocus() {
        return null
    },
    setActive: function setActive() {
        return null
    }
});

export const TabNavigationContext = createContext();

export const ModalProvider = ModalContext.Provider;
export const SelectProvider = SelectContext.Provider;
export const FormFieldProvider = FormFieldContext.Provider;
export const TabNavigationProvider = TabNavigationContext.Provider;