import { Slider } from "@mui/material";
import React, { useCallback, useState } from "react";
import ReactDOM from "react-dom";
import Cropper from "react-easy-crop";
import { Area } from "react-easy-crop/types";
import { AiOutlineClose } from "react-icons/ai";
import styled from "styled-components";
import getCroppedImg from "../config/cropImage";

const Overlay = styled.div`
  width: 100%;
  height: 100%;
  z-index: 10000;
  background-color: rgba(0, 0, 0, 0.4);
  position: fixed;
  display: grid;
  place-items: center;
  top: 0;
  left: 0;
`;

const Container = styled.div``;

const Box = styled.div`
  background-color: #fff;
  box-shadow: 0 1px 4px 0 rgb(0 0 0 / 10%);
  border-radius: 4px;
  padding: 20px;
  width: 500px;
`;

const BoxHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  h3 {
    font-weight: 500;
  }

  svg {
    cursor: pointer;
  }
`;

const BoxContent = styled.div`
  position: relative;
  width: 100%;
  height: 500px;
`;

const BoxAction = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const SaveButton = styled.button`
  color: #fff;
  background-color: #ee4d2d;
  border-color: #ee4d2d;
  outline: none;
  border: none;
  padding: 5px 20px;
  border-radius: 4px;
  cursor: pointer;
`;

type Props = {
  closeModal: () => void;
  image: string;
  setBackground: React.Dispatch<React.SetStateAction<any>>;
  index: number;
  setImages: React.Dispatch<React.SetStateAction<{ id: number; file: File }[]>>;
  fileName: string;
};

const CropImageModal: React.FC<Props> = (props) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area>({
    width: 0,
    height: 0,
    x: 0,
    y: 0,
  });

  const onCropComplete = useCallback(
    (croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  const getCroppedImage = useCallback(async () => {
    try {
      const croppedImage = await getCroppedImg(
        props.image,
        croppedAreaPixels,
        0,
        props.fileName
      );
      props.setBackground(URL.createObjectURL(croppedImage));
      props.closeModal();
      props.setImages((images) => {
        const list = images.filter((image) => image.id !== props.index);
        return [...list, { id: props.index, file: croppedImage }];
      });
    } catch (e) {
      console.error(e);
    }
  }, [croppedAreaPixels, props]);

  const modal = (
    <Overlay>
      <Container>
        <Box>
          <BoxHeader>
            <h3>Chỉnh sửa hình ảnh</h3>
            <AiOutlineClose onClick={props.closeModal} />
          </BoxHeader>
          <BoxContent>
            <Cropper
              image={props.image}
              crop={crop}
              zoom={zoom}
              aspect={3 / 3}
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
            />
          </BoxContent>
          <BoxAction>
            <Slider
              value={zoom}
              min={1}
              max={10}
              step={0.1}
              aria-labelledby="Zoom"
              onChange={(e, zoom) => setZoom(Number(zoom))}
              classes={{ root: "slider" }}
            />
            <SaveButton onClick={getCroppedImage}>Lưu</SaveButton>
          </BoxAction>
        </Box>
      </Container>
    </Overlay>
  );
  return ReactDOM.createPortal(modal, document.body);
};

export default CropImageModal;
