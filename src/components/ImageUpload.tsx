import React, { useRef, useState } from "react";
import styled from "styled-components";

import { AiOutlinePlusCircle } from "react-icons/ai";
import { BsCrop, BsTrashFill } from "react-icons/bs";
import useModal from "../hooks/useModal";
import CropImageModal from "./CropImageModal";

const Container = styled.div`
  position: relative;
`;

const Content = styled.div<{ background: string }>`
  width: 80px;
  height: 80px;
  border: 1px solid
    ${(props) => (props.background ? "rgba(0,0,0,.2)" : "#1791f2")};
  border-radius: 4px;
  border-style: ${(props) => (props.background ? "solid" : "dashed")};

  &:hover {
    background-color: #def0ff;
    cursor: pointer;
  }

  input[type="file"] {
    display: none;
  }
`;

const ImageTool = styled.div`
  display: none;
  position: absolute;
  bottom: 0;
  align-items: center;
  justify-content: space-around;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  padding: 4px 0;

  .decollator {
    height: 16px;
    width: 1px;
    background: hsla(0, 0%, 100%, 0.5);
  }

  span {
    color: #fff;
    font-size: 14px;
    cursor: pointer;
  }
`;

const Image = styled.div<{ background: string }>`
  background-image: url(${(props) => props.background});
  background-repeat: no-repeat;
  background-position: 50% center;
  background-size: contain;
  width: 80px;
  height: 80px;
  z-index: ${(props) => (props.background ? 10 : -1)};
  position: absolute;
  cursor: move;

  &:hover ${ImageTool} {
    display: flex;
  }
`;

const IconContainer = styled.div`
  display: grid;
  place-items: center;
  height: 100%;
`;

const ExplainText = styled.div`
  margin-top: 10px;
  text-align: center;
`;

interface Props {
  explainText: string;
  setImages: React.Dispatch<React.SetStateAction<{ id: number; file: File }[]>>;
  index: number;
  imageUrl?: string;
}

const ImageUpload: React.FC<Props> = ({ explainText, setImages, index, imageUrl }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [background, setBackground] = useState(imageUrl ? imageUrl : "");
  const [fileName, setFileName] = useState("");

  const { isOpen, openModal, closeModal } = useModal();

  const chooseImage = () => {
    inputRef?.current?.click();
  };

  const onChangeFile = () => {
    if (inputRef.current?.files) {
      const file = inputRef.current.files[0];
      setBackground(URL.createObjectURL(file));
      setFileName(file.name);
      setImages((images) => [...images, { id: index, file: file }]);
    }
  };

  const removeFile = () => {
    if (inputRef.current) {
      inputRef.current.value = "";
      setBackground("");
      setImages((images) => images.filter((image) => image.id !== index));
    }
  };

  return (
    <Container>
      {isOpen && (
        <CropImageModal
          closeModal={closeModal}
          image={background}
          setBackground={setBackground}
          fileName={fileName}
          setImages={setImages}
          index={index}
        />
      )}
      <Image background={background}>
        <ImageTool>
          <span onClick={openModal}>
            <BsCrop />
          </span>
          <span className="decollator"></span>
          <span onClick={removeFile}>
            <BsTrashFill />
          </span>
        </ImageTool>
      </Image>
      <Content onClick={chooseImage} background={background}>
        <IconContainer>
          <AiOutlinePlusCircle color="#1791f2" size={20} />
        </IconContainer>
        <input
          ref={inputRef}
          type="file"
          accept="image/png, image/jpeg, image/jpg"
          onChange={onChangeFile}
        />
      </Content>
      <ExplainText>
        <p>{explainText}</p>
      </ExplainText>
    </Container>
  );
};

export default ImageUpload;
