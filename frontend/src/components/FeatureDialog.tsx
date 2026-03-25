import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogOverlay,
} from "@/components/ui/dialog";
import { Switch } from "./ui/switch";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "./ui/slider";
import { Textarea } from "./ui/textarea";
import { useState } from "react";

type Props = {
	open: boolean;
	setOpen: (open: boolean) => void;
	onCancel: () => void;
	onSave: (data: any) => void;
};

const FeatureDialog = ({ open, setOpen, onCancel, onSave }: Props) => {
	const savedStyles = localStorage.getItem("savedStyles");

	const styles: any = savedStyles ? JSON.parse(savedStyles) : defaultStyles;

	const [outlineColor, setOutlineColor] = useState(styles.color);
	const [outlineWidth, setOutlineWidth] = useState([styles.weight]);
	const [fillColor, setFillColor] = useState(styles.fillColor);
	const [fillOpacity, setFillOpacity] = useState([styles.fillOpacity]);

	const [isCustom, setIsCustom] = useState(false);

	const handleSubmit = (e: any) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		const style = isCustom ? defaultStyles : {
			color: formData.get("outline-color"),
			weight: formData.get("outline-width"),
			fillColor: formData.get("fill-color"),
			fillOpacity: formData.get("fill-opacity"),
			radius: defaultStyles.radius,
		};
		formData.delete("outline-color");
		formData.delete("outline-width");
		formData.delete("fill-color");
		formData.delete("fill-opacity");
		formData.append("style", JSON.stringify(style));
		onSave(formData);
	};
	return (
		<Dialog
			open={open}
			onOpenChange={(nextOpen) => {
				if (!nextOpen) {
					onCancel();
				} else {
					setOpen(true);
				}
			}}
		>
			<DialogOverlay className="backdrop-blur-sm bg-black/30 z-9998" />
			<DialogContent
				className="sm:max-w-sm z-9999"
				onInteractOutside={(e) => e.preventDefault()}
			>
				<form onSubmit={handleSubmit}>
					<DialogHeader>
						<DialogTitle>New Feature</DialogTitle>
						<DialogDescription>
							Enter feature details.
						</DialogDescription>
					</DialogHeader>
					<FieldGroup className="mt-5">
						<Field>
							<Label htmlFor="name">Name</Label>
							<Input id="name" name="name" required />
						</Field>

						<Field>
							<Label htmlFor="username">Notes</Label>
							<Textarea id="notes" name="notes" />
						</Field>

						<div className="flex items-center space-x-2 mb-3">
							<Switch
								id="airplane-mode"
								checked={isCustom}
								onCheckedChange={() => setIsCustom(!isCustom)}
							/>
							<Label htmlFor="airplane-mode">Custom Style</Label>
						</div>

						{isCustom && (
							<>
								<div className="divider flex items-center justify-center">
									<div className="border-bottom border-gray border grow"></div>
									<div className="px-5 text-black/50 font-bold">
										STYLE
									</div>
									<div className="border-bottom border-gray border grow"></div>
								</div>

								<Field>
									<Label>Outline Color</Label>
									<Input
										name="outline-color"
										type="color"
										value={outlineColor}
										onChange={(e) =>
											setOutlineColor(e.target.value)
										}
									/>
								</Field>

								<Field>
									<Label>Outline Width: {outlineWidth}</Label>
									<Slider
										value={outlineWidth}
										onValueChange={(value) =>
											setOutlineWidth(value)
										}
										name="outline-width"
										min={0}
										max={5}
										step={0.1}
									/>
								</Field>

								<Field>
									<Label>Fill Color</Label>
									<Input
										name="fill-color"
										type="color"
										value={fillColor}
										onChange={(e) =>
											setFillColor(e.target.value)
										}
									/>
								</Field>

								<Field>
									<Label>Fill Opacity: {fillOpacity}</Label>
									<Slider
										value={fillOpacity}
										onValueChange={(value) =>
											setFillOpacity(value)
										}
										name="fill-opacity"
										min={0}
										max={1}
										step={0.1}
									/>
								</Field>
							</>
						)}
					</FieldGroup>
					<DialogFooter>
						<Button
							className="cursor-pointer"
							type="button"
							variant="outline"
							onClick={onCancel}
						>
							Cancel
						</Button>
						<Button className="cursor-pointer" type="submit">
							Save changes
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
};

const defaultStyles = {
	color: "red",
	weight: 1,
	fillColor: "red",
	fillOpacity: 0.5,
	radius: 8,
};

export default FeatureDialog;
