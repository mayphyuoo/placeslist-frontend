import React, {Suspense} from "react";
import {
	BrowserRouter as Router,
	Redirect,
	Route,
	Switch,
} from "react-router-dom";

// import Users from "./user/pages/Users";
// import NewPlace from "./places/pages/NewPlace";
// import UserPlaces from "./places/pages/UserPlaces";
import MainNavigation from "./misc/components/Navigation/MainNavigation";
import LoadingSpinner from "./misc/components/UIElements/LoadingSpinner";
// import UpdatePlace from "./places/pages/UpdatePlace";
// import Authenticate from "./user/pages/Authenticate";
import { AuthContext } from "./misc/context/auth-context";
import { useAuth } from "./misc/hooks/auth-hook";

const Users = React.lazy(() => import('./user/pages/Users'));
const NewPlace = React.lazy(() => import('./places/pages/NewPlace'));
const UserPlaces = React.lazy(() => import('./places/pages/UserPlaces'));
const UpdatePlace = React.lazy(() => import('./places/pages/UpdatePlace'));
const Authenticate = React.lazy(() => import('./user/pages/Authenticate'));

function App() {

    const { token, login, logout, userId } = useAuth();

	let routes;

	if (token) {
		routes = (
			<Switch>
				<Route path="/" exact>
					<Users />
				</Route>
				<Route path="/:userId/places" exact>
					<UserPlaces />
				</Route>
				<Route path="/places/new" exact>
					<NewPlace />
				</Route>
				<Route path="/places/:placeId">
					<UpdatePlace />
				</Route>
				<Redirect to="/" />
			</Switch>
		);
	} else {
		routes = (
			<Switch>
				<Route path="/" exact>
					<Users />
				</Route>
				<Route path="/:userId/places" exact>
					<UserPlaces />
				</Route>
				<Route path="/auth" exact>
					<Authenticate />
				</Route>
				<Redirect to="/auth" />
			</Switch>
		);
	}

	return (
		<AuthContext.Provider
			value={{
				isLoggedIn: !!token,
				token: token,
				userId: userId,
				login: login,
				logout: logout,
			}}
		>
			<Router>
				<MainNavigation />
				<main>
                    <Suspense fallback={<div className="center"><LoadingSpinner /></div>}>
                        {routes}
                    </Suspense>
                </main>
			</Router>
		</AuthContext.Provider>
	);
}

export default App;
