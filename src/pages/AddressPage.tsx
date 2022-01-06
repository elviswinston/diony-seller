import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { IoLocationOutline } from "react-icons/io5";
import { useSelector } from "react-redux";
import { ReduxState } from "../types/ReduxState";
import UserService from "../services/user.services";
import useModal from "../hooks/useModal";
import ManageAddressModal from "../components/ManageAddressModal";
import { AddressResponse } from "../types/Address";

const Container = styled.div`
  background-color: #f6f6f6;
  display: grid;
  place-items: center;
  padding: 20px 0;
`;

const BoxContainer = styled.div`
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 1px 4px 0 rgb(0 0 0 / 10%);
  margin-bottom: 20px;
  width: 80%;
`;

const BoxHeader = styled.div`
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ccc;
`;

const Title = styled.div`
  span {
    font-size: 14px;
    color: #999;
  }
`;

const AddAddressButton = styled.button`
  color: #fff;
  background-color: #ee4d2d;
  border: none;
  outline: none;
  border-radius: 4px;
  padding: 10px 20px;
  cursor: pointer;
`;

const BoxContent = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  row-gap: 40px;
`;

const AddressContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const AddressContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  row-gap: 10px;
  margin-left: 34px;
`;

const AddressAction = styled.div``;

const Label = styled.div`
  color: rgba(85, 85, 85, 0.8);
  font-size: 14px;
  line-height: 24px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 6fr;
  p {
    line-height: 24px;
  }
`;

const Button = styled.div`
  color: #2673dd;
  background-color: transparent;
  border-color: transparent;
  height: unset;
  min-width: unset;
  padding: 0;
  font-weight: 400;
  line-height: 24px;
  cursor: pointer;
`;

const Detail = styled.div`
  white-space: pre-wrap;
`;

const NameWrapper = styled.div`
  display: flex;
  align-items: center;
  column-gap: 10px;

  .default {
    color: #40d0bd;
    background-color: #e8f9f7;
  }

  .pickup {
    color: #ee4d2d;
    background-color: #fff1f0;
  }

  .return {
    color: #eda500;
    background-color: #fff7e0;
  }
`;

const Tag = styled.div`
  font-size: 12px;
  border-radius: 4px;
  padding: 0 6px;
`;

const AddressPage: React.FC = () => {
  const userInfo = useSelector((state: ReduxState) => state.userLogin.userInfo);
  const [addresses, setAddresses] = useState<AddressResponse[]>([]);
  const [updatedAddress, setUpdatedAddress] = useState<AddressResponse>();

  useEffect(() => {
    const getAddress = () => {
      if (userInfo) {
        UserService.getAddress(userInfo.token).then((response) => {
          if (response.status === 200) {
            setAddresses(response.data);
          }
        });
      }
    };

    getAddress();
  }, [userInfo]);

  const { isOpen, openModal, closeModal } = useModal();
  const deleteAddress = (addressId: number) => {
    userInfo &&
      UserService.deleteAddress(addressId, userInfo.token).then((response) => {
        if (response.status === 200) {
          setAddresses((previous) =>
            previous.filter((address) => address.id !== addressId)
          );
        }
      });
  };

  return (
    <Container>
      {isOpen && (
        <ManageAddressModal
          closeModal={closeModal}
          address={updatedAddress}
          setAddress={setUpdatedAddress}
          setAddresses={setAddresses}
        />
      )}
      <BoxContainer>
        <BoxHeader>
          <Title>
            <h2>Địa chỉ</h2>
            <span>Quản lý việc vận chuyển và địa chỉ giao hàng của bạn</span>
          </Title>
          <div>
            <AddAddressButton
              onClick={() => {
                openModal();
              }}
            >
              Thêm địa chỉ mới
            </AddAddressButton>
          </div>
        </BoxHeader>
        <BoxContent>
          {addresses.length > 0 &&
            addresses.map((address) => (
              <AddressContainer key={address.id}>
                <IoLocationOutline size={28} color="#00bfa5" />
                <AddressContent>
                  <Grid>
                    <Label>Họ và Tên</Label>
                    <NameWrapper>
                      <p>{address.customerName}</p>
                      {address.isDefault && (
                        <Tag className="default">Mặc định</Tag>
                      )}
                      {address.isPickup && (
                        <Tag className="pickup">Địa chỉ lấy hàng</Tag>
                      )}
                      {address.isReturn && (
                        <Tag className="return">Địa chỉ trả hàng</Tag>
                      )}
                    </NameWrapper>
                  </Grid>
                  <Grid>
                    <Label>Số điện thoại</Label>
                    <p>{address.phoneNumber}</p>
                  </Grid>
                  <Grid>
                    <Label>Địa chỉ</Label>
                    <Detail>
                      <p>{address.detail}</p>
                      <p>{address.wardName}</p>
                      <p>{address.districtName}</p>
                      <p>{address.provinceName}</p>
                    </Detail>
                  </Grid>
                </AddressContent>
                <AddressAction>
                  <Button
                    onClick={() => {
                      setUpdatedAddress(address);
                      openModal();
                    }}
                  >
                    Sửa
                  </Button>
                  {!address.isDefault && (
                    <Button onClick={() => deleteAddress(address.id)}>
                      Xoá
                    </Button>
                  )}
                </AddressAction>
              </AddressContainer>
            ))}
        </BoxContent>
      </BoxContainer>
    </Container>
  );
};

export default AddressPage;
