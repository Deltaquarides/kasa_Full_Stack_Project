import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

export const ListingForm = ({
  options,
  selectedValues = [],
  onChange,
  labelField = "label",
  valueField = "value",
  placeholder = "Select options",
}) => {
  //selectedOptions is the child component's local state, used to manage the selection within the dropdown (checkboxes).
  //  It is initialized from selectedValues (passed from the parent)
  // // but is updated independently when the user interacts with the checkboxes.
  //The child needs to manage interactions and display the current selection.
  const [selectedOptions, setSelectedOptions] = useState(selectedValues);
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    // Update selected options when the prop `selectedValues` changes
    setSelectedOptions(selectedValues);
  }, [selectedValues]);

  // Toggle the dropdown visibility
  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  // Handle checkbox change
  const handleCheckboxChange = (value) => {
    const newSelectedOptions = selectedOptions.includes(value)
      ? selectedOptions.filter((option) => option !== value)
      : [...selectedOptions, value];

    setSelectedOptions(newSelectedOptions); // Update local state
    onChange(newSelectedOptions); // Update parent state, Notify parent of change
    console.log(selectedOptions);
  };

  // Remove a selected option when delete is clicked
  const handleRemoveOption = (value) => {
    const newSelectedOptions = selectedOptions.filter(
      (option) => option !== value
    );
    setSelectedOptions(newSelectedOptions);
    onChange(newSelectedOptions);
  };

  return (
    <div>
      <div className="dropdown-toggle" onClick={toggleDropdown}>
        {selectedOptions.length > 0
          ? `Selected: ${selectedOptions.length} option(s)`
          : placeholder}
      </div>

      {isDropdownOpen && (
        <div style={{ height: "90px", overflowY: "scroll", width: "171px" }}>
          {options.map((option) => (
            <div key={option[valueField]}>
              <label>
                <input
                  type="checkbox"
                  checked={selectedOptions.includes(option[valueField])}
                  onChange={() => handleCheckboxChange(option[valueField])}
                  onClick={() => {
                    handleRemoveOption(selectedOptions);
                  }}
                />
                {option[labelField]}
              </label>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Prop types for better validation and documentation
ListingForm.propTypes = {
  options: PropTypes.array.isRequired,
  selectedValues: PropTypes.array,
  onChange: PropTypes.func.isRequired,
  labelField: PropTypes.string,
  valueField: PropTypes.string,
  placeholder: PropTypes.string,
};
