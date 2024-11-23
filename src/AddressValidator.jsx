import React, { useState } from 'react';
import axios from 'axios';
import './addressvalidator.css'; 

const AddressValidator = () => {
    const [formData, setFormData] = useState({
        houseNumber: '',
        street: '',
        locality: '',
        neighbourhood: '',
        borough: '',
        region: '',
        postalCode: '',
        country: 'India', 
        landmark: '', 
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

    const handleLandmarkSearchChange = async (e) => {
        const { name, value } = e.target;

        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));

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
        const { houseNumber, street, neighbourhood, borough, locality, region, postalCode, country, landmark } =
            formData;

        if (!houseNumber || !street || !locality || !region || !postalCode) {
            setError('Please fill out all mandatory fields.');
            return;
        }

        setError(null);
        setValidationResult(null);

        const address = `${houseNumber}, ${street}, ${landmark}, ${neighbourhood}, ${borough}, ${locality}, ${region}, ${postalCode}, ${country}`;

        try {
            const response = await axios.get(`https://api.olamaps.io/places/v1/addressvalidation`, {
                params: { address, api_key: apiKey },
            });

            const { data } = response;
            if (data?.result?.validated === true) {
                setValidationResult({
                    validated_address: `${data.result.validated_address}, Landmark: ${landmark}`,
                    corrected_postal_code: data.result.corrected_postal_code || postalCode,
                });
            } else {
                await handleCorrectAddressUsingNeighbourhoodAndBorough(neighbourhood, borough);
            }
        } catch (err) {
            setError(err.response?.data?.error_message || 'An error occurred during validation');
        }
    };

    const handleCorrectAddressUsingNeighbourhoodAndBorough = async (neighbourhood, borough) => {
        try {
            const response = await axios.get('https://api.olamaps.io/places/v1/autocomplete', {
                params: { input: `${neighbourhood}, ${borough}`, api_key: apiKey },
            });

            if (response.data.predictions.length > 0) {
                const correctedAddress = response.data.predictions[0].structured_formatting.main_text;
                const correctedPostalCode = response.data.predictions[0].terms.find((term) =>
                    /^[0-9]{6}$/.test(term.value)
                )?.value;
                setFormData((prevData) => ({
                    ...prevData,
                    postalCode: correctedPostalCode || prevData.postalCode,
                }));
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
        const selectedLandmark = selectedAddress.structured_formatting.main_text;
        const selectedPostalCode = selectedAddress.terms.find((term) => /^[0-9]{6}$/.test(term.value))?.value;

        setFormData((prevData) => ({
            ...prevData,
            landmark: selectedLandmark,
            postalCode: selectedPostalCode || prevData.postalCode,
        }));

        setValidationResult((prevResult) => ({
            ...prevResult,
            validated_address: prevResult?.validated_address
                ? `${prevResult.validated_address}, Landmark: ${selectedLandmark}`
                : selectedLandmark,
            corrected_postal_code: selectedPostalCode || prevResult?.corrected_postal_code || formData.postalCode,
        }));

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
                        onChange={handleChange}
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

                <div>
                    <label className="block font-medium mb-1">Landmark</label>
                    <input
                        type="text"
                        name="landmark"
                        value={formData.landmark}
                        onChange={handleLandmarkSearchChange}
                        className="p-2 border rounded w-full"
                        placeholder="Enter landmark"
                    />
                    {autocompleteResults.length > 0 && (
                        <ul className="landmark-dropdown">
                            {autocompleteResults.map((result, index) => (
                                <li
                                    key={index}
                                    className="cursor-pointer p-2 hover:bg-gray-200"
                                    onClick={() => handleAutocompleteSelect(result)}
                                >
                                    {result.structured_formatting.main_text}
                                </li>
                            ))}
                        </ul>
                    )}
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
