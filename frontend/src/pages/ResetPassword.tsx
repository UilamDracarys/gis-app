import { FieldGroup, Field } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const ResetPassword = () => {

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        toast.warning("This feature is coming soon. To reset your password, please contact system administrator at williamcernestojr@yahoo.com;");
    }
    
	return (
		<>
			<title>Reset Password | SimpleGIS</title>
			<div className="bg-black/10 h-screen w-full flex justify-center items-center">
				<div
					className="login w-[90vw] md:w-[40vw] max-w-120 bg-white rounded-lg shadow-md shadow-gray-500
        p-5
        flex flex-col gap-2
        "
				>
					<img
						src="gis.png"
						alt="icon"
						width="100"
						className="mx-auto"
					/>
					<h2 className="text-2xl text-center font-bold">Reset Password</h2>
					<p className="text-xs text-center text-gray-600 mb-5">
						Enter the email associated with your account to receive password reset instructions.
					</p>
					<form onSubmit={handleSubmit}>
						<FieldGroup>
							<Field>
								<Label htmlFor="username">Email address</Label>
								<Input
									id="email"
                                    type="email"
									className="bg-white mb-2 h-10 "
									placeholder="Enter your email..."
									required
								></Input>
							</Field>
						</FieldGroup>
                        <button
							className="mt-5 bg-black  hover:bg-white hover:text-black hover:border hover:border-black active:bg-black/30 active:text-white active:border-none w-full rounded-md text-white font-bold h-10 cursor-pointer  transition-all duration-300 ease flex justify-center items-center gap-2
						disabled:bg-gray-300
						disabled:hover:bg-gray-300
						disabled:hover:text-white
						disabled:hover:border-none
						disabled:cursor-not-allowed
						
						"
						>
                            Reset Password

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

export default ResetPassword;
