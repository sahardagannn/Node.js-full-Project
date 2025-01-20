import React, { useState } from 'react';
import { Box, TextField, Button } from '@mui/material';

interface UserProfile {
  name: { first: string; middle?: string; last: string };
  email: string;
  phone: string;
  address: {
    country: string;
    city: string;
    street: string;
    houseNumber: string;
    zip?: string;
  };
  image: { url: string; alt: string };
}

interface EditProfileFormProps {
  initialData: UserProfile;
  onSave: (updatedProfile: UserProfile) => void;
  onCancel: () => void;
}

const EditProfileForm: React.FC<EditProfileFormProps> = ({ initialData, onSave, onCancel }) => {
  const [formData, setFormData] = useState<UserProfile>(initialData);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name in formData.address) {
      setFormData({
        ...formData,
        address: { ...formData.address, [name]: value },
      });
    } else if (name in formData.name) {
      setFormData({
        ...formData,
        name: { ...formData.name, [name]: value },
      });
    } else if (name === 'alt') {
      setFormData({ ...formData, image: { ...formData.image, alt: value } });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <TextField
        label="First Name"
        name="first"
        fullWidth
        margin="normal"
        value={formData.name.first}
        onChange={handleInputChange}
      />
      <TextField
        label="Middle Name"
        name="middle"
        fullWidth
        margin="normal"
        value={formData.name.middle || ''}
        onChange={handleInputChange}
      />
      <TextField
        label="Last Name"
        name="last"
        fullWidth
        margin="normal"
        value={formData.name.last}
        onChange={handleInputChange}
      />
      <TextField
        label="Email"
        name="email"
        fullWidth
        margin="normal"
        value={formData.email}
        onChange={handleInputChange}
        type="email"
      />
      <TextField
        label="Phone"
        name="phone"
        fullWidth
        margin="normal"
        value={formData.phone}
        onChange={handleInputChange}
      />
      <TextField
        label="Country"
        name="country"
        fullWidth
        margin="normal"
        value={formData.address.country}
        onChange={handleInputChange}
      />
      <TextField
        label="City"
        name="city"
        fullWidth
        margin="normal"
        value={formData.address.city}
        onChange={handleInputChange}
      />
      <TextField
        label="Street"
        name="street"
        fullWidth
        margin="normal"
        value={formData.address.street}
        onChange={handleInputChange}
      />
      <TextField
        label="House Number"
        name="houseNumber"
        fullWidth
        margin="normal"
        value={formData.address.houseNumber}
        onChange={handleInputChange}
      />
      <TextField
        label="Image URL"
        name="url"
        fullWidth
        margin="normal"
        value={formData.image.url}
        onChange={(e) =>
          setFormData({ ...formData, image: { ...formData.image, url: e.target.value } })
        }
      />
      <TextField
        label="Alt Text"
        name="alt"
        fullWidth
        margin="normal"
        value={formData.image.alt}
        onChange={handleInputChange}
      />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
        <Button type="submit" variant="contained" color="primary">
          Save
        </Button>
        <Button variant="outlined" color="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </Box>
    </Box>
  );
};

export default EditProfileForm;
