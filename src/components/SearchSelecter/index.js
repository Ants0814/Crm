import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';

const SelectContainer = styled.div`
  position: relative;
  width: 100%;
  
`;

const SelectHeader = styled.div`
  border: 1px solid #ddd;
  padding: 7px;
  border-radius: 4px;
  cursor: pointer;
  background-color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size:12px;
`;

const Placeholder = styled.span`
  color: #888;
`;

const DropdownContainer = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  margin-top: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: white;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  max-height: 200px;
  overflow-y: auto;
  z-index: 10;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 10px;
  border: none;
  border-bottom: 1px solid #ccc;
  outline: none;
  
`;

const Option = styled.div`
  padding: 10px;
  cursor: pointer;

  &:hover {
    background-color: #f0f0f0;
  }
`;

const ArrowIcon = styled.svg`
  width: 20px;
  height: 20px;
  fill: #888;
`;

const ClearButton = styled.button`
  background: none;
  border: none;
  color: #007bff;
  cursor: pointer;
  padding: 10px;
  text-align: left;
  width: 100%;
  
  &:hover {
    text-decoration: underline;
  }
`;

const SearchSelecter = ({ options, value, onChange, isSearch,isCancel,placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const filteredOptions = options?.filter(option =>
    option?.std_key?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectOption = (optionValue) => {
    onChange({ target: { value: optionValue } });
    setIsOpen(false);
  };

  const handleClearSelection = () => {
    onChange({ target: { value: '' } });
    setSearchTerm('');
    setIsOpen(false);
  };

  const selectedOption = options?.find(option => option.std_value === value);

  return (
    <SelectContainer ref={dropdownRef}>
      <SelectHeader onClick={() => setIsOpen(!isOpen)}>
        {selectedOption ? (
          <span>{selectedOption.std_key}</span>
        ) : (
          <Placeholder>{placeholder}</Placeholder>
        )}
        <ArrowIcon viewBox="0 0 20 20">
          <path d="M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0 0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z" />
        </ArrowIcon>
      </SelectHeader>
      {isOpen && (
        <DropdownContainer>
         {isSearch && <SearchInput
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />}
          {isCancel && selectedOption && (
            <ClearButton onClick={handleClearSelection}>
              선택 취소
            </ClearButton>
          )}
          {filteredOptions?.map(option => (
            <Option
              key={option.std_value}
              onClick={() => handleSelectOption(option.std_value)}
            >
              {option.std_key}
            </Option>
          ))}
        </DropdownContainer>
      )}
    </SelectContainer>
  );
};

export default SearchSelecter;