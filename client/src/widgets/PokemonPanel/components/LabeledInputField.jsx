import InputField from './InputField.jsx';
import LabeledField from './LabeledField.jsx';

/**
 * @param {Object} props
 * @param {string} props.fieldName
 * @param {import('react').HTMLInputTypeAttribute} props.fieldType
 * @param {string|number|readonly string[]|undefined} props.fieldValue
 * @param {import('react').ChangeEventHandler<HTMLInputElement, HTMLInputElement>} props.onChange
 * @returns
 */
export default function LabeledInputField({
  fieldName,
  fieldType,
  fieldValue,
  onChange,
}) {
  return (
    <LabeledField fieldName={fieldName}>
      <InputField
        fieldType={fieldType}
        fieldValue={fieldValue}
        onChange={onChange}
      />
    </LabeledField>
  );
}
