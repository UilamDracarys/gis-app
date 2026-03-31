import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import auth from "@/services/api/auth";
import { useAuth } from "@/contexts/AuthContext";
import { Loader } from "lucide-react";

const Register = () => {
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	const navigate = useNavigate();
	const { setUser } = useAuth();

	const validatePassword = () => {
		if (password.length < 8) {
			return "Password must be at least 8 characters";
		}

		if (!/[A-Z]/.test(password)) {
			return "Password must contain at least one uppercase letter";
		}

		if (!/[a-z]/.test(password)) {
			return "Password must contain at least one lowercase letter";
		}

		if (!/[0-9]/.test(password)) {
			return "Password must contain at least one number";
		}

		return null;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
		setLoading(true);
		if (password !== confirmPassword) {
			setError("Passwords don't match");
			setLoading(false);
			return;
		}

		const passwordError = validatePassword();
		if (passwordError) {
			setError(passwordError);
			setLoading(false);
			return;
		}

		const res = await auth.register({
			first_name: firstName,
			last_name: lastName,
			username,
			email,
			password,
		});

		if (res.error) {
			setError(`ERROR: ${res.error}`);
			return;
		}

		const user = await auth.getUser();

		if (user) {
			setUser(user);
			navigate("/");
		}
		setLoading(false);
	};

	return (
		<>
			<title>Register | SimpleGIS</title>
			<div className="bg-black/10 h-screen w-full flex justify-center overflow-y-auto ">
				<div className="self-start register my-10 w-[90vw] md:w-[40vw] max-w-120 bg-white rounded-lg shadow-md shadow-gray-500 px-5 py-8 flex flex-col">
					<img
						src="gis.png"
						alt="icon"
						width="100"
						className="mx-auto"
					/>
					<h2 className="text-2xl text-center font-bold">Register</h2>
					<p className="text-xs text-center text-gray-600 mb-5">
						Fill the form below.
					</p>
					<form onSubmit={handleSubmit}>
						<FieldGroup className="gap-5 mb-5">
							<Field>
								<Label htmlFor="first-name">First Name</Label>
								<Input
									id="first-name"
									className="bg-white h-10"
									placeholder="Enter your first name..."
									required
									value={firstName}
									onChange={(e) =>
										setFirstName(e.target.value)
									}
								></Input>
							</Field>
							<Field>
								<Label htmlFor="last-name">Last Name</Label>
								<Input
									id="last-name"
									className="bg-white h-10"
									placeholder="Enter your last name..."
									required
									value={lastName}
									onChange={(e) =>
										setLastName(e.target.value)
									}
								></Input>
							</Field>

							<Field>
								<Label htmlFor="username">Username</Label>
								<Input
									id="username"
									className="bg-white h-10"
									placeholder="Enter your username..."
									required
									value={username}
									onChange={(e) =>
										setUsername(e.target.value)
									}
								></Input>
							</Field>
							<Field>
								<Label htmlFor="email">Email</Label>
								<Input
									id="username"
									className="bg-white h-10"
									placeholder="e.g. john.doe@email.com"
									type="email"
									required
									value={email}
									onChange={(e) => setEmail(e.target.value)}
								></Input>
							</Field>

							<Field>
								<Label htmlFor="password">Password</Label>
								<Input
									id="password"
									type="password"
									className="bg-white h-10"
									placeholder="Enter your password..."
									required
									value={password}
									onChange={(e) =>
										setPassword(e.target.value)
									}
								></Input>
							</Field>

							<Field>
								<Label htmlFor="confirm-password">
									Confirm Password
								</Label>
								<Input
									id="confirm-password"
									type="password"
									className="bg-white h-10"
									placeholder="Confirm your password..."
									required
									value={confirmPassword}
									onChange={(e) =>
										setConfirmPassword(e.target.value)
									}
								></Input>
							</Field>
						</FieldGroup>

						{error && (
							<p className="text-red-500 text-sm mb-2">{error}</p>
						)}

						<button
							className="mt-5 bg-black  hover:bg-white hover:text-black hover:border hover:border-black active:bg-black/30 active:text-white active:border-none w-full rounded-md text-white font-bold h-10 cursor-pointer  transition-all duration-300 ease flex justify-center items-center gap-2
						disabled:bg-gray-300
						disabled:hover:bg-gray-300
						disabled:hover:text-white
						disabled:hover:border-none
						disabled:cursor-not-allowed
						
						"
							disabled={loading}
						>
							{loading ? (
								<>
									Registering ...{" "}
									<Loader className="animate-spin" />
								</>
							) : (
								"Register"
							)}
						</button>

						<div className="flex items-center my-4">
							<div className="grow border-t border-gray-300" />
							<span className="mx-3 text-gray-500 text-sm">
								OR
							</span>
							<div className="grow border-t border-gray-300" />
						</div>
						<Link
							to="/login"
							className="min-h-10 flex justify-center items-center bg-white/20 border-black border w-full rounded-md text-black font-bold h-10 cursor-pointer hover:bg-black hover:text-white active:bg-black/30 active:text-white active:border-none  transition-all duration-300 ease"
						>
							Login
						</Link>
					</form>
				</div>
			</div>
		</>
	);
};

export default Register;
