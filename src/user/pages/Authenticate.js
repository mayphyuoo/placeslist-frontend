import React, { useState, useContext } from "react";

import "./Authenticate.css";

import {
	VALIDATOR_EMAIL,
	VALIDATOR_MINLENGTH,
	VALIDATOR_REQUIRE,
} from "../../misc/util/validators";
import Input from "../../misc/components/FormElements/Input";
import Button from "../../misc/components/FormElements/Button";
import Card from "../../misc/components/UIElements/Card";
import ImageUpload from "../../misc/components/FormElements/ImageUpload";
import ErrorModal from "../../misc/components/UIElements/ErrorModal";
import LoadingSpinner from "../../misc/components/UIElements/LoadingSpinner";

import { useForm } from "../../misc/hooks/form-hooks";
import { useHttpClient } from "../../misc/hooks/http-hook";
import { AuthContext } from "../../misc/context/auth-context";

function Authenticate() {
	const auth = useContext(AuthContext);
	const [isLoginMode, setIsLoginMode] = useState(true);
	const { isLoading, error, sendRequest, clearError } = useHttpClient();

	const [formState, inputHandler, setFormData] = useForm(
		{
			email: {
				value: "",
				isValid: false,
			},
			password: {
				value: "",
				isValid: false,
			},
		},
		false
	);

	const authenticateSubmitHandler = async (event) => {
		event.preventDefault();

		if (isLoginMode) {
			// Login mode
			try {
				const responseData = await sendRequest(
					process.env.REACT_APP_BACKEND_URL + "/users/login",
					"POST",
					JSON.stringify({
						email: formState.inputs.email.value,
						password: formState.inputs.password.value,
					}),
					{
						"Content-Type": "application/json",
					}
				);
				auth.login(responseData.userId, responseData.token);
			} catch (err) {}
		} else {
			// Sign up mode
			try {
                const formData = new FormData();
                formData.append('email', formState.inputs.email.value);
                formData.append('name', formState.inputs.name.value);
                formData.append('password', formState.inputs.password.value);
                formData.append('image', formState.inputs.image.value);
				const responseData = await sendRequest(
					process.env.REACT_APP_BACKEND_URL + "/users/signup",
					"POST",
					formData
				);
				auth.login(responseData.userId, responseData.token);
			} catch (err) {
				
			}
		}
	};

	const switchModeHandler = () => {
		if (!isLoginMode) {
			setFormData(
				{
					...formState.inputs,
					name: undefined,
                    image: undefined,
				},
				formState.inputs.email.isValid &&
					formState.inputs.password.isValid
			);
		} else {
			setFormData(
				{
					...formState.inputs,
					name: {
						value: "",
						isValid: false,
					},
                    image: {
                        value: null,
                        isValid: false,
                    }
				},
				false
			);
		}
		setIsLoginMode((prevMode) => !prevMode);
	};

	return (
		<React.Fragment>
			<ErrorModal error={error} onClear={clearError} />
            <div className="center">
            <Card className="authentication">
				{isLoading && <LoadingSpinner asOverlay />}
				<h2>Login Required</h2>
				<hr />
				<form onSubmit={authenticateSubmitHandler}>
					{!isLoginMode && (
						<Input
							element="input"
							id="name"
							type="text"
							label="Your Name"
							validators={[VALIDATOR_REQUIRE]}
							errorText="Please enter a name."
							onInput={inputHandler}
						/>
					)}
                    {!isLoginMode && <ImageUpload center id="image" onInput={inputHandler} errorText="Please provide an image." /> }
					<Input
						id="email"
						element="input"
						type="email"
						label="Email"
						validators={[VALIDATOR_EMAIL()]}
						errorText="Please enter a valid email address."
						onInput={inputHandler}
					/>
					<Input
						id="password"
						element="input"
						type="password"
						label="Password"
						validators={[VALIDATOR_MINLENGTH(6)]}
						errorText="Please enter a valid password, at least 6 characters."
						onInput={inputHandler}
					/>
					<Button type="submit" disabled={!formState.isValid}>
						{isLoginMode ? "LOGIN" : "SIGNUP"}
					</Button>
				</form>
				<Button inverse onClick={switchModeHandler}>
					SWITCH TO {isLoginMode ? "SIGNUP" : "LOGIN"}
				</Button>
			</Card>
            </div>
		</React.Fragment>
	);
}

export default Authenticate;
