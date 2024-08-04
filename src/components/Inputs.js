import Select from "react-select";

export function MultiSelect({ options, defaultValue }) {
  return (<Select name="roles" options={options}
    className="multi-select-container"
    classNamePrefix="multi-select"
    unstyled
    isMulti
    defaultValue={defaultValue}
  />)
}

export function EditableField({ isEditing, label, defaultValue, name }) {
  return (
    <div className="py-4 sm:px-4 flex flex-row align-middle">
      <div className="flex items-center min-w-32">{label}</div> <div className="editable-field-input">{isEditing ? <input name={name} type="text" defaultValue={defaultValue} className="in-record-input" /> : defaultValue} </div> </div>
  )
}
