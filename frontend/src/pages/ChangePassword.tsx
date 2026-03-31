import { useState } from "react";
import { Key } from "lucide-react";
import { Field } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";
import auth from "@/services/api/auth";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const ChangePassword = () => {
	const navigate = useNavigate();
	const [curPwdError, setCurPwdError] = useState<string[]>([]);
	const [newPwdError, setNewPwdError] = useState<string[]>([]);

	const handleSubmit = async (e: any) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);

		if (formData.get("new-password") !== formData.get("confirm-password")) {
			toast.error("Passwords don't match.");
			setNewPwdError(["Passwords don't match"]);
			return;
		} else {
			setNewPwdError([]);
		}

		const res = await auth.changePassword(
			formData.get("current-password"),
			formData.get("new-password"),
		);

		console.log(res);

		if (!res.success) {
			if (res.error.new_password) {
				setNewPwdError(res.error.new_password);
				return;
			}

			if (res.error.old_password) {
				setCurPwdError(res.error.old_password);
				return;
			}
			console.log(res);
		}

		await Swal.fire({
			title: "Password Changed!",
			text: "Log in again.",
			icon: "success",
			customClass: {
				popup: "!rounded-2xl !p-6 !w-auto",
				title: "!text-2xl !font-bold",
				confirmButton:
					"cursor-pointer bg-black hover:bg-white hover:text-black text-white px-4 py-2 rounded",
			},
			buttonsStyling: false,
			confirmButtonText: "Login",
		});

		await auth.logout();
		navigate("/login");
	};
	return (
		<div className="h-screen w-full py-5 px-4">
			<h1 className="text-2xl font-bold  mt-5 flex gap-2 items-center">
				<Key />
				Change Password
			</h1>
			<div className="border rounded-lg p-4 mt-3 overflow-auto">
				<form
					className="max-w-80 flex flex-col gap-5"
					onSubmit={handleSubmit}
				>
					<Field>
						<Label htmlFor="">Current Password</Label>
						<Input
							required
							name="current-password"
							type="password"
							placeholder="Enter your current password..."
						/>
						{curPwdError.length > 0 && (
							<div className="flex flex-col">
								{curPwdError.map((err, index) => (
									<span
										key={index}
										className="text-red-500 block"
									>
										{err}
									</span>
								))}
							</div>
						)}
					</Field>
					<Field>
						<Label htmlFor="">New Password</Label>
						<Input
							required
							name="new-password"
							type="password"
							placeholder="Enter your new password..."
						/>
						{newPwdError.length > 0 && (
							<div className="flex flex-col">
								{newPwdError.map((err, index) => (
									<span
										key={index}
										className="text-red-500 block"
									>
										{err}
									</span>
								))}
							</div>
						)}
					</Field>
					<Field>
						<Label htmlFor="">Confirm Password</Label>
						<Input
							required
							name="confirm-password"
							type="password"
							placeholder="Confirm your new password..."
						/>
					</Field>
					<button
						type="submit"
						className="bg-black text-white rounded-md py-2 cursor-pointer hover:bg-white hover:text-black
                        border-black border transition-all ease duration-300
                    "
					>
						Change Password
					</button>
				</form>
			</div>
		</div>
	);
};

export default ChangePassword;
