import React from 'react';
import {
  ProfileContainer,
  Title,
  InfoSection,
  InfoTitle,
  InfoText
} from './ProfilePage.styles'; // Import the styled components

const ProfilePage = () => {
  // Replace with actual user data in a real application
  const user = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    address: '1234 Elm Street, Springfield',
    phone: '(123) 456-7890',
  };

  return (
    <ProfileContainer>
      <Title>Profile</Title>
      <InfoSection>
        <InfoTitle>Name</InfoTitle>
        <InfoText>{user.name}</InfoText>
      </InfoSection>
      <InfoSection>
        <InfoTitle>Email</InfoTitle>
        <InfoText>{user.email}</InfoText>
      </InfoSection>
      <InfoSection>
        <InfoTitle>Address</InfoTitle>
        <InfoText>{user.address}</InfoText>
      </InfoSection>
      <InfoSection>
        <InfoTitle>Phone</InfoTitle>
        <InfoText>{user.phone}</InfoText>
      </InfoSection>
    </ProfileContainer>
  );
};

export default ProfilePage;
