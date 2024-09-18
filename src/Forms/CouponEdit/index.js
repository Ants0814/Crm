import React, { useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  width:100%;
  margin: 0 auto;
  padding: 20px;
`;

const StyledForm = styled.form`
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-bottom: 20px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 2fr));
  gap: 16px;
`;

const FormField = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  margin-bottom: 5px;
  font-weight: bold;
  color: #333;
`;

const Select = styled.select`
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
`;

const Input = styled.input`
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
`;

const Button = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px 15px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
  width: 100%;
  margin-top: 20px;

  &:hover {
    background-color: #0056b3;
  }
`;

const EditorContainer = styled.div`
  width:60%;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;
`;

const TextArea = styled.textarea`
  width: 100%;
  height: 150px;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
  resize: vertical;
`;

const SaveButton = styled(Button)`
  background-color: #28a745;

  &:hover {
    background-color: #218838;
  }
`;

const SearchUI = () => {
  const [editorOne, setEditorOne] = useState('');
  const [editorTwo, setEditorTwo] = useState('');

  return (
    <Container>
        <div style={{width:'80%',display:'flex'}}>
      <StyledForm>
        <Grid>
          <FormField>
            <Label htmlFor="siteType">사이트명</Label>
            <Select id="siteType">
              <option value="피시인사이드">피시인사이드</option>
            </Select>
          </FormField>

          <FormField>
            <Label htmlFor="userType">사용자명</Label>
            <Select id="userType">
              <option value="all">All</option>
            </Select>
          </FormField>

          <FormField>
            <Label htmlFor="dateRange">쿠폰등록기간</Label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <Input type="date" />
              <span>~</span>
              <Input type="date" />
            </div>
          </FormField>

          <FormField>
            <Label htmlFor="vipStatus">쿠폰등급</Label>
            <Select id="vipStatus">
              <option value="all">All VIPs</option>
            </Select>
          </FormField>

          <FormField>
            <Label htmlFor="usage">쿠폰사용가능</Label>
            <Select id="usage">
              <option value="true">True</option>
              <option value="false">False</option>
            </Select>
          </FormField>

          <FormField>
            <Label htmlFor="number">할인쿠폰수</Label>
            <Input type="number" min="1" id="number" />
          </FormField>

          <FormField>
            <Label htmlFor="couponLength">쿠폰번호길이</Label>
            <Input type="text" id="couponLength" placeholder="004" />
          </FormField>
        </Grid>

        <Button type="submit">검색</Button>
      </StyledForm>

      <EditorContainer>
        <Grid>
          <FormField>
            <Label>내용1</Label>
            <TextArea
              value={editorOne}
              onChange={(e) => setEditorOne(e.target.value)}
            />
          </FormField>
          <FormField>
            <Label>내용2</Label>
            <TextArea
              value={editorTwo}
              onChange={(e) => setEditorTwo(e.target.value)}
            />
          </FormField>
        </Grid>
        <SaveButton onClick={() => console.log({ editorOne, editorTwo })}>
          저장
        </SaveButton>
      </EditorContainer>
      </div>
    </Container>
  );
};

export default SearchUI;