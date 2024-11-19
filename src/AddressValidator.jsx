import React, { useState } from 'react';
import axios from 'axios';
import './addressvalidator.css'; // Import the CSS file

const AddressValidator = () => {
    const [formData, setFormData] = useState({
        houseNumber: '',
        street: '',
        locality: '',
        neighbourhood: '',
        borough: '',
        region: '',
        postalCode: '',
        country: 'India', // Default to India
    });
    const [validationResult, setValidationResult] = useState(null);
    const [error, setError] = useState(null);
    const [autocompleteResults, setAutocompleteResults] = useState([]);

    const apiKey = 'URedrrYH9PfgLCt9bCy7WittVBCpvnRtxqwCaXhn'; // Replace with your API key

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSearchChange = async (e) => {
        const { name, value } = e.target;

        // Update the field value in the form
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));

        // Skip API call for the 'neighbourhood' field
        if (name === 'neighbourhood') {
            return;
        }

        if (!value) {
            setAutocompleteResults([]);
            return;
        }

        try {
            const response = await axios.get(`https://api.olamaps.io/places/v1/autocomplete`, {
                params: { input: value, api_key: apiKey },
            });
            setAutocompleteResults(response.data.predictions);
        } catch (err) {
            console.error('Error fetching autocomplete data:', err);
        }
    };

    const handleValidate = async () => {
        const { houseNumber, street, neighbourhood, borough, locality, region, postalCode, country } = formData;

        // Ensure required fields are filled
        if (!houseNumber || !street || !locality || !region || !postalCode) {
            setError('Please fill out all mandatory fields.');
            return;
        }

        setError(null);
        setValidationResult(null);

        // Construct the address parameter
        const address = `${houseNumber}, ${street}, ${neighbourhood}, ${borough}, ${locality}, ${region}, ${postalCode}, ${country}`;

        try {
            const response = await axios.get(`https://api.olamaps.io/places/v1/addressvalidation`, {
                params: { address, api_key: apiKey },
            });

            const { data } = response;
            if (data?.result?.validated === true) {
                setValidationResult(data.result);
            } else {
                // Address validation failed, perform a search using neighbourhood and borough
                await handleCorrectAddressUsingNeighbourhoodAndBorough(neighbourhood, borough);
            }
        } catch (err) {
            setError(err.response?.data?.error_message || 'An error occurred during validation');
        }
    };

    const handleCorrectAddressUsingNeighbourhoodAndBorough = async (neighbourhood, borough) => {
        // Search with the neighbourhood and borough to get the correct postal code
        try {
            const response = await axios.get('https://api.olamaps.io/places/v1/autocomplete', {
                params: { input: `${neighbourhood}, ${borough}`, api_key: apiKey },
            });

            if (response.data.predictions.length > 0) {
                // Get the first result and update the postal code
                const correctedAddress = response.data.predictions[0].structured_formatting.main_text;
                setFormData((prevData) => ({
                    ...prevData,
                    postalCode: response.data.predictions[0].postalCode || prevData.postalCode,
                }));
                const correctedPostalCode = response.data.predictions[0].terms.find((term) =>
                    /^[0-9]{6}$/.test(term.value)
                )?.value;
                setValidationResult({
                    validated_address: correctedAddress,
                    corrected_postal_code: correctedPostalCode,
                });
                setError(null);
            } else {
                setError('No suggestions found for the given neighbourhood and borough.');
            }
        } catch (err) {
            setError('Error fetching corrected address data.');
        }
    };

    const handleAutocompleteSelect = (selectedAddress) => {
        // Populate the form with the selected autocomplete suggestion
        setFormData({
            ...formData,
            neighbourhood: selectedAddress.structured_formatting.main_text, // Example field for neighbourhood
            postalCode: selectedAddress.postalCode || formData.postalCode, // If postal code is suggested, update it
        });

        // Optionally close the autocomplete dropdown
        setAutocompleteResults([]);
    };

    return (
        <div className="address-validator">
            <h2 className="text-xl font-bold mb-4">Address Validator</h2>
            <form className="space-y-4">
                <div>
                    <label className="block font-medium mb-1">House Number*</label>
                    <input
                        type="text"
                        name="houseNumber"
                        value={formData.houseNumber}
                        onChange={handleChange}
                        className="p-2 border rounded w-full"
                        placeholder="Enter house number"
                    />
                </div>

                <div>
                    <label className="block font-medium mb-1">Street*</label>
                    <input
                        type="text"
                        name="street"
                        value={formData.street}
                        onChange={handleChange}
                        className="p-2 border rounded w-full"
                        placeholder="Enter street"
                    />
                </div>

                <div>
                    <label className="block font-medium mb-1">Neighbourhood</label>
                    <input
                        type="text"
                        name="neighbourhood"
                        value={formData.neighbourhood}
                        onChange={handleSearchChange}
                        className="p-2 border rounded w-full"
                        placeholder="Enter neighbourhood"
                    />
                </div>

                <div>
                    <label className="block font-medium mb-1">Area*</label>
                    <input
                        type="text"
                        name="borough"
                        value={formData.borough}
                        onChange={handleChange}
                        className="p-2 border rounded w-full"
                        placeholder="Enter borough"
                    />
                </div>

                <div>
                    <label className="block font-medium mb-1">District/City*</label>
                    <input
                        type="text"
                        name="locality"
                        value={formData.locality}
                        onChange={handleChange}
                        className="p-2 border rounded w-full"
                        placeholder="Enter locality"
                    />
                </div>

                <div>
                    <label className="block font-medium mb-1">State*</label>
                    <input
                        type="text"
                        name="region"
                        value={formData.region}
                        onChange={handleChange}
                        className="p-2 border rounded w-full"
                        placeholder="Enter state/region"
                    />
                </div>

                <div>
                    <label className="block font-medium mb-1">Postal Code*</label>
                    <input
                        type="text"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleChange}
                        className="p-2 border rounded w-full"
                        placeholder="Enter postal code"
                    />
                </div>

                <div>
                    <label className="block font-medium mb-1">Country*</label>
                    <input
                        type="text"
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        className="p-2 border rounded w-full"
                        placeholder="Enter country"
                        readOnly
                    />
                </div>
            </form>

            <button
                onClick={handleValidate}
                className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
            >
                Validate Address
            </button>

            {error && <div className="text-red-500 mt-4">{error}</div>}

            {validationResult && (
            <div className="mt-4 p-4 border rounded bg-gray-50">
                <h3 className="font-bold">Validation Result</h3>
                <p><strong>Validated Address:</strong> {validationResult.validated_address}</p>
                <p><strong>Corrected Postal Code:</strong> {validationResult.corrected_postal_code}</p>
            </div>
        )}
        </div>
    );
};

export default AddressValidator;
