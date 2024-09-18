import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';

const WriteBox = styled.div`
  grid-column: span 4;
`;

const TitleInput = styled.input`
  width: 100%;
  margin-bottom: 10px;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const EditorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 10px;
`;

const VisualEditor = styled.div`
  display: ${({ visible }) => (visible ? 'block' : 'none')};
  width: 100%;
  border: 1px solid hsla(0, 0%, 4%, 0.1);
`;

const SourceEditor = styled.div`
  display: ${({ visible }) => (visible ? 'block' : 'none')};
  width: 100%;
  border-bottom: 1px solid #e2e8f0;
`;

const Textarea = styled.textarea`
  width: 100%;
  min-height: 200px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const Button = styled.button`
  padding: 10px 24px;
  margin: 5px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  background-color: #1f2937;
  width: 100%;
  ${({ variant }) => variant === 'blue' && `
    background-color: #1f2937;
    color: white;
  `}
  ${({ variant }) => variant === 'green' && `
    background-color: #1f2937;
    color: white;
  `}
`;

const ActionButton = styled.button`
  padding: 5px 10px;
  background-color: white;
  border: 1px solid #ddd;
  cursor: pointer;
  border-radius: 4px;
  svg {
    width: 20px;
    height: 20px;
  }

  &:hover {
    background-color: #e5e7eb;
  }

  & > b, & > i, & > u {
    font-weight: bold;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const ActionBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding: 0.5rem;
  border-bottom: 1px solid #e2e8f0;
`;

const Tabs = styled.div`
  display: flex;
`;

const Tab = styled.button`
  padding: 10px 15px;
  background-color: ${({ active }) => (active ? 'white' : '#f3f4f6')};
  color: ${({ active }) => (active ? 'black' : '#333')};
  border: 1px solid #ddd;
  border-radius: 4px 4px 0 0;
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s, border-bottom 0.2s;
  
  &:hover {
    background-color: ${({ active }) => (active ? 'white' : '#e2e8f0')};
    border: 1px solid #ddd;
    border-bottom: none;
  }
`;

const ModalBackground = styled.div`
  display: ${({ visible }) => (visible ? 'flex' : 'none')};
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
`;

const TableGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(10, 20px);
  grid-template-rows: repeat(10, 20px);
  gap: 2px;
  margin: 10px 0;
`;

const TableCell = styled.div`
  width: 20px;
  height: 20px;
  background-color: ${({ selected }) => (selected ? '#4CAF50' : '#ddd')};
  cursor: pointer;
`;

const RichTextEditor = ({reqPost,handleEditorChange,onTitleChange }) => {
  const [showTableModal, setShowTableModal] = useState(false);
  const [tableSize, setTableSize] = useState({ rows: 0, cols: 0 });
  const [title, setTitle] = useState('');
  const [htmlContent, setHtmlContent] = useState('글을 작성하세요');
  const [activeTab, setActiveTab] = useState('visual');
  const [resizing, setResizing] = useState(false);
  const [resizeDir, setResizeDir] = useState(null);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [startSize, setStartSize] = useState({ width: 0, height: 0 });
  const [selectedCells, setSelectedCells] = useState([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [canMerge, setCanMerge] = useState(false);
  const [canSplit, setCanSplit] = useState(false);
  const resizingTable = useRef(null);
  const editorRef = useRef(null);
  const resizingCell = useRef(null);
  const previousHtmlContent = useRef(htmlContent);

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
    onTitleChange(event.target.value);
  };

  const handleHtmlChange = (event) => {
    setHtmlContent(event.target.value);
    if (handleEditorChange) {
      handleEditorChange(event.target.value); // Call onChange prop when content changes
    }
  };

  const handleVisualEditorInput = () => {
    if (editorRef.current && editorRef.current.innerHTML !== previousHtmlContent.current) {
      previousHtmlContent.current = editorRef.current.innerHTML;
      setHtmlContent(editorRef.current.innerHTML);
      handleEditorChange(editorRef.current.innerHTML);
      if (handleEditorChange) {
        handleEditorChange(editorRef.current.innerHTML); // Call onChange prop when content changes
      }
    }
  };


  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('제목:', title);
    console.log('내용:', htmlContent);
  };

  const executeCommand = (command, value = null) => {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      let selectedElement = selection.getRangeAt(0).commonAncestorContainer;
      // Ensure selectedElement is an Element node
      if (selectedElement.nodeType !== Node.ELEMENT_NODE) {
        selectedElement = selectedElement.parentElement;
      }
      const table = selectedElement.closest('table');
      if (table && (command === 'justifyLeft' || command === 'justifyCenter' || command === 'justifyRight' || command === 'justifyFull')) {
        if (command === 'justifyLeft') {
          table.style.margin = '0';
          table.style.marginLeft = '0';
        } else if (command === 'justifyCenter') {
          table.style.margin = '0 auto';
        } else if (command === 'justifyRight') {
          table.style.margin = '0';
          table.style.marginLeft = 'auto';
        } else if (command === 'justifyFull') {
          table.style.margin = '0';
          table.style.marginLeft = '0';
        }
      } else {
        document.execCommand(command, false, value);
      }
    } else {
      document.execCommand(command, false, value);
    }
    editorRef.current.focus();
  };

  const actions = [
    { name: 'bold', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 4h8a4 4 0 014 4 4 4 0 01-4 4H6V4zm0 8h9a4 4 0 014 4 4 4 0 01-4 4H6v-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>, title: 'Bold', command: 'bold' },
    { name: 'italic', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M19 4h-9M14 20H5M15 4L9 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>, title: 'Italic', command: 'italic' },
    { name: 'underline', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 3v7a6 6 0 006 6 6 6 0 006-6V3M4 21h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>, title: 'Underline', command: 'underline' },
    { name: 'heading1', icon:<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><text x="4" y="17" fontFamily="Arial, sans-serif" fontSize="16" fontWeight="bold" fill="currentColor">H1</text></svg>, title: 'Heading 1', command: 'formatBlock', value: 'H1' },
    { name: 'heading2', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><text x="4" y="17" fontFamily="Arial, sans-serif" fontSize="16" fontWeight="bold" fill="currentColor">H2</text></svg>, title: 'Heading 2', command: 'formatBlock', value: 'H2' },
    { name: 'olist', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 6h11M10 12h11M10 18h11M4 6h1v4M4 10h1M5 18H3.5a.5.5 0 01-.5-.5v-1a.5.5 0 01.5-.5H5v-2H3.5a.5.5 0 01-.5-.5v-1a.5.5 0 01.5-.5H5v1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>, title: 'Ordered List', command: 'insertOrderedList' },
    { name: 'ulist', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>, title: 'Unordered List', command: 'insertUnorderedList' },
    { name: 'link', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>, title: 'Link', command: 'createLink', prompt: true },
    { name: 'image', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="8.5" cy="8.5" r="1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M21 15l-5-5L5 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>, title: 'Image', command: 'insertImage', prompt: true },
    { name: 'justifyLeft', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17 10H3M21 6H3M21 14H3M17 18H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>, title: 'Align Left', command: 'justifyLeft' },
    { name: 'justifyCenter', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18 10H6M21 6H3M21 14H3M18 18H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>, title: 'Align Center', command: 'justifyCenter' },
    { name: 'justifyRight', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21 10H7M21 6H3M21 14H3M21 18H7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>, title: 'Align Right', command: 'justifyRight' },
    { name: 'justifyFull', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 6h18M3 10h18M3 14h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>, title: 'Justify', command: 'justifyFull' },
    { name: 'table', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 4h16v16H4z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M4 9h16M9 4v16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>, title: 'Table', command: 'insertTable' },
    { name: 'mergeCells', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 6h12v12H6zM6 10h12M6 14h12M10 6v12M14 6v12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M9 10l3 3-3 3M15 10l-3 3 3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>, title: 'Merge Cells', command: 'mergeCells' },
    { name: 'splitCell', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 6h12v12H6zM6 10h12M6 14h12M10 6v12M14 6v12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>, title: 'Split Cell', command: 'splitCell' }
  ];

  useEffect(() => {
    if (editorRef.current && activeTab === 'visual' && editorRef.current.innerHTML !== htmlContent) {
      editorRef.current.innerHTML = htmlContent;
    }
  }, [activeTab, htmlContent]);

  useEffect(() => {
    if (editorRef.current) {
      const tables = editorRef.current.querySelectorAll('table');
      tables.forEach((table) => {
        const cells = table.querySelectorAll('td, th');
        cells.forEach((cell) => {
          const existingHandles = cell.querySelectorAll('div[style*="position: absolute"]');
          existingHandles.forEach(handle => handle.remove());

          addResizeHandles(cell);
        });
      });
    }

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [resizing, htmlContent]);

  useEffect(() => {
    if (editorRef.current) {
      const cells = editorRef.current.querySelectorAll('td, th');
      cells.forEach((cell) => {
        cell.style.backgroundColor = selectedCells.includes(cell) ? '#b3d4fc' : '';
      });
    }

    setCanMerge(selectedCells.length > 1);
    setCanSplit(selectedCells.length === 1 && (selectedCells[0].colSpan > 1 || selectedCells[0].rowSpan > 1));
  }, [selectedCells]);

  useEffect(() => {
    if (isEditing) {
      const cells = editorRef.current.querySelectorAll('td, th');
      cells.forEach((cell) => {
        cell.contentEditable = selectedCells.includes(cell) ? 'true' : 'false';
      });
    }
  }, [isEditing, selectedCells]);

  const handleResizeMouseDown = (e, cell, dir) => {
    setResizing(true);
    setResizeDir(dir);
    setStartPos({ x: e.clientX, y: e.clientY });
    setStartSize({ width: cell.offsetWidth, height: cell.offsetHeight });
    resizingCell.current = cell;
    e.preventDefault();
    e.stopPropagation();
  };

  const handleMouseMove = (e) => {
    if (resizing) {
      const deltaX = e.clientX - startPos.x;
      const deltaY = e.clientY - startPos.y;

      if (resizingCell.current && resizeDir === 'horizontal') {
        const newWidth = Math.max(startSize.width + deltaX, 20);
        resizingCell.current.style.width = `${newWidth}px`;
      }
      if (resizingCell.current && resizeDir === 'vertical') {
        const newHeight = Math.max(startSize.height + deltaY, 20);
        resizingCell.current.style.height = `${newHeight}px`;
      }
    }
  };

  const handleMouseUp = () => {
    setIsSelecting(false);
    if (resizing) {
      setResizing(false);
      setResizeDir(null);
      resizingCell.current = null;
      resizingTable.current = null;
      setHtmlContent(editorRef.current.innerHTML);
    }
  };

  const handleTableMouseOver = (rowIndex, colIndex) => {
    setTableSize({ rows: rowIndex + 1, cols: colIndex + 1 });
  };

  const addTable = () => {
    const { rows, cols } = tableSize;
    let table = '<table border="1" style="border-collapse: collapse">';
    for (let i = 0; i < rows; i++) {
      table += '<tr>';
      for (let j = 0; j < cols; j++) {
        table += '<td style="position: relative; width: 100px; height: 50px;">&nbsp;</td>';
      }
      table += '</tr>';
    }
    table += '</table>';

    const range = document.createRange();
    range.selectNodeContents(editorRef.current);
    range.collapse(false);
    const fragment = range.createContextualFragment(table);
    editorRef.current.appendChild(fragment);

    setHtmlContent(editorRef.current.innerHTML);
    editorRef.current.focus();
    setShowTableModal(false);
  };

  const mergeCells = () => {
    if (selectedCells.length < 2) return;

    const firstCell = selectedCells[0];
    const lastCell = selectedCells[selectedCells.length - 1];
    const firstRowIndex = firstCell.parentElement.rowIndex;
    const lastRowIndex = lastCell.parentElement.rowIndex;
    const firstCellIndex = firstCell.cellIndex;
    const lastCellIndex = lastCell.cellIndex;

    const rowspan = lastRowIndex - firstRowIndex + 1;
    const colspan = lastCellIndex - firstCellIndex + 1;

    firstCell.rowSpan = rowspan;
    firstCell.colSpan = colspan;

    for (let i = firstRowIndex; i <= lastRowIndex; i++) {
      const row = firstCell.parentElement.parentElement.rows[i];
      for (let j = firstCellIndex; j <= lastCellIndex; j++) {
        const cell = row.cells[j];
        if (cell !== firstCell) {
          cell.remove();
        }
      }
    }

    setHtmlContent(editorRef.current.innerHTML);
    setSelectedCells([]);
  };

  const splitCell = () => {
    if (selectedCells.length !== 1) return;

    const cell = selectedCells[0];
    const colspan = cell.colSpan;
    const rowspan = cell.rowSpan;
    cell.colSpan = 1;
    cell.rowSpan = 1;

    for (let i = 0; i < rowspan; i++) {
      const row = cell.parentElement.parentElement.rows[cell.parentElement.rowIndex + i];
      for (let j = 0; j < colspan; j++) {
        if (i === 0 && j === 0) continue;
        const newCell = document.createElement(cell.tagName);
        newCell.innerHTML = '&nbsp;';
        row.insertBefore(newCell, row.cells[cell.cellIndex + 1]);
      }
    }

    setHtmlContent(editorRef.current.innerHTML);
    setSelectedCells([]);
  };

  const handleCellMouseDown = (e) => {
    if (isEditing) return;

    const cell = e.target.closest('td, th');
    if (cell) {
      setIsSelecting(true);
      setSelectedCells([cell]);
    }
  };

  const handleCellMouseOver = (e) => {
    if (isSelecting && !isEditing) {
      const cell = e.target.closest('td, th');
      if (cell) {
        const firstCell = selectedCells[0];
        const lastCell = cell;

        const firstRowIndex = firstCell?.parentElement?.rowIndex;
        const lastRowIndex = lastCell?.parentElement?.rowIndex;
        const firstCellIndex = firstCell?.cellIndex;
        const lastCellIndex = lastCell?.cellIndex;

        if (firstRowIndex === undefined || lastRowIndex === undefined || firstCellIndex === undefined || lastCellIndex === undefined) {
          return;
        }

        const newSelectedCells = [];
        for (let i = Math.min(firstRowIndex, lastRowIndex); i <= Math.max(firstRowIndex, lastRowIndex); i++) {
          const row = firstCell.parentElement.parentElement.rows[i];
          for (let j = Math.min(firstCellIndex, lastCellIndex); j <= Math.max(firstCellIndex, lastCellIndex); j++) {
            newSelectedCells.push(row.cells[j]);
          }
        }

        setSelectedCells(newSelectedCells);
      }
    }
  };

  const handleDoubleClick = (e) => {
    const cell = e.target.closest('td, th');
    if (cell) {
      setIsEditing(true);
      setSelectedCells([]);
      cell.contentEditable = 'true';
      cell.focus();
    }
  };

  const handleBlur = (e) => {
    const cell = e.target.closest('td, th');
    if (cell) {
      setIsEditing(false);
      cell.contentEditable = 'false';
      setHtmlContent(editorRef.current.innerHTML);
    }
  };

  const addResizeHandles = (cell) => {
    cell.style.position = 'relative';

    const rightHandle = document.createElement('div');
    rightHandle.style.position = 'absolute';
    rightHandle.style.right = '-3px';
    rightHandle.style.top = '0';
    rightHandle.style.width = '6px';
    rightHandle.style.height = '100%';
    rightHandle.style.cursor = 'col-resize';
    rightHandle.style.backgroundColor = 'transparent';
    rightHandle.onmousedown = (e) => handleResizeMouseDown(e, cell, 'horizontal');

    const bottomHandle = document.createElement('div');
    bottomHandle.style.position = 'absolute';
    bottomHandle.style.left = '0';
    bottomHandle.style.bottom = '-3px';
    bottomHandle.style.width = '100%';
    bottomHandle.style.height = '6px';
    bottomHandle.style.cursor = 'row-resize';
    bottomHandle.style.backgroundColor = 'transparent';
    bottomHandle.onmousedown = (e) => handleResizeMouseDown(e, cell, 'vertical');

    cell.appendChild(rightHandle);
    cell.appendChild(bottomHandle);
  };

  return (
    <WriteBox>
      <form onSubmit={handleSubmit}>
        <TitleInput
          type="text"
          placeholder="제목을 입력하세요"
          value={title}
          onChange={handleTitleChange}
        />
        <Tabs>
          <Tab active={activeTab === 'visual'} onClick={(e) => { e.preventDefault(); setActiveTab('visual'); }}>
            시각 편집기
          </Tab>
          <Tab active={activeTab === 'source'} onClick={(e) => { e.preventDefault(); setActiveTab('source'); }}>
            소스 편집기
          </Tab>
        </Tabs>
        <EditorContainer>
          <VisualEditor visible={activeTab === 'visual'}>
            <ActionBar>
              {actions.map((action) => (
                <ActionButton
                  key={action.name}
                  title={action.title}
                  onClick={(e) => {
                    e.preventDefault();
                    if (action.command === 'insertTable') {
                      setShowTableModal(true);
                    } else if (action.command === 'mergeCells') {
                      mergeCells();
                    } else if (action.command === 'splitCell') {
                      splitCell();
                    } else if (action.prompt) {
                      const url = window.prompt('Enter the link URL');
                      executeCommand(action.command, url);
                    } else {
                      executeCommand(action.command, action.value);
                    }
                  }}
                  disabled={(action.command === 'mergeCells' && !canMerge) || (action.command === 'splitCell' && !canSplit)}
                >
                  {action.icon}
                </ActionButton>
              ))}
            </ActionBar>
            <div
              ref={editorRef}
              style={{ height: '20rem', border: '1px solid #ccc', padding: '10px' }}
              contentEditable={!isEditing}
              onInput={handleVisualEditorInput}
              onMouseDown={handleCellMouseDown}
              onMouseOver={handleCellMouseOver}
              onMouseUp={handleMouseUp}
              onDoubleClick={handleDoubleClick}
              onBlur={handleBlur}
            ></div>
          </VisualEditor>
          <SourceEditor visible={activeTab === 'source'}>
            <Textarea
              id="html-output"
              name="html-output"
              placeholder="글을 작성하세요"
              rows="20"
              cols="80"
              value={htmlContent}
              onChange={handleHtmlChange}
              onBlur={handleHtmlChange}
            />
          </SourceEditor>
        </EditorContainer>
        <Button variant="green" type="submit" onClick={reqPost}>
          글쓰기
        </Button>
      </form>
      <ModalBackground visible={showTableModal}>
        <ModalContent>
          <TableGrid>
            {[...Array(10)].map((_, rowIndex) =>
              [...Array(10)].map((_, colIndex) => (
                <TableCell
                  key={`${rowIndex}-${colIndex}`}
                  selected={rowIndex < tableSize.rows && colIndex < tableSize.cols}
                  onMouseOver={() => handleTableMouseOver(rowIndex, colIndex)}
                  onClick={(e) => {
                    e.preventDefault();
                    addTable();
                  }}
                />
              ))
            )}
          </TableGrid>
          <Button variant="green" onClick={(e) => {
            e.preventDefault();
            setShowTableModal(false);
          }}>
            Cancel
          </Button>
        </ModalContent>
      </ModalBackground>
    </WriteBox>
  );
};

export default RichTextEditor;