import React, { useContext } from "react";
import { useHistory } from "react-router-dom";

import "./PlaceForm.css";

import {
	VALIDATOR_MINLENGTH,
	VALIDATOR_REQUIRE,
} from "../../misc/util/validators";
import Button from "../../misc/components/FormElements/Button";
import Input from "../../misc/components/FormElements/Input";
import ImageUpload from "../../misc/components/FormElements/ImageUpload";
import ErrorModal from "../../misc/components/UIElements/ErrorModal";
import LoadingSpinner from "../../misc/components/UIElements/LoadingSpinner";

import { useForm } from "../../misc/hooks/form-hooks"
import { useHttpClient } from "../../misc/hooks/http-hook"
import { AuthContext } from '../../misc/context/auth-context'

function NewPlace() {
    const auth = useContext(AuthContext);
    const {isLoading, error, sendRequest, clearError} = useHttpClient();
	const [formState, inputHandler] = useForm({
			title: {
				value: "",
				isValid: false,
			},
			description: {
				value: "",
				isValid: false,
			},
            address: {
				value: "",
				isValid: false,
			},
            image: {
                value: null,
                isValid: false,
            }
        }, false);

    const history = useHistory();

    const placeSubmitHandler = async event => {
        event.preventDefault();
        try {
            const formData = new FormData();
            formData.append('title', formState.inputs.title.value);
            formData.append('description', formState.inputs.description.value);
            formData.append('address', formState.inputs.address.value);
            formData.append('image', formState.inputs.image.value);
            await sendRequest(process.env.REACT_APP_BACKEND_URL + '/places', 'POST', formData, {
                Authorization: 'Bearer ' + auth.token
            });

            // TODO: redirect user to different page
            history.push('/');
            
        } catch (err) {}
        
    };

	return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError} />
            <form className="place-form" onSubmit={placeSubmitHandler}>
                {isLoading && <LoadingSpinner asOverlay />}
                <Input
                    id="title"
                    type="text"
                    label="Title"
                    element="input"
                    validators={[VALIDATOR_REQUIRE()]}
                    errorText="Please enter a valid title."
                    onInput={inputHandler}
                />
                <Input
                    id="description"
                    label="Description"
                    element="textarea"
                    validators={[VALIDATOR_MINLENGTH(5)]}
                    errorText="Please enter a valid description (at least 5 characters)."
                    onInput={inputHandler}
                />
                <Input
                    id="address"
                    label="Address"
                    element="input"
                    type="text"
                    validators={[VALIDATOR_REQUIRE()]}
                    errorText="Please enter a valid address."
                    onInput={inputHandler}
                />
                <ImageUpload center id="image" onInput={inputHandler} errorText="Please provide an image." />
                <Button type="submit" disabled={!formState.isValid}>
                    ADD PLACE
                </Button>
            </form>
        </React.Fragment>
		
	);
}

export default NewPlace;
