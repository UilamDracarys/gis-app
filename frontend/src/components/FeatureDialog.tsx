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
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Switch } from "./ui/switch";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "./ui/slider";
import { Textarea } from "./ui/textarea";
import { useState, useEffect } from "react";
import { Globe, Lock } from "lucide-react";

type Props = {
	open: boolean;
	setOpen: (open: boolean) => void;
	onCancel: () => void;
	onSave: (data: any) => void;
	featureData?: any;
};

const FeatureDialog = ({
	open,
	setOpen,
	onCancel,
	onSave,
	featureData,
}: Props) => {
	const savedStyles = localStorage.getItem("savedStyles");

	const styles: any = savedStyles ? JSON.parse(savedStyles) : defaultStyles;

	const visibilityOptions: any = [
		{ label: "Only Me", value: "only-me", icon: <Lock /> },
		{ label: "Public", value: "public", icon: <Globe /> },
	];

	const [id, setId] = useState(null);
	const [name, setName] = useState("");
	const [notes, setNotes] = useState("");
	const [visibility, setVisibility] = useState("only-me");
	const [outlineColor, setOutlineColor] = useState(styles.color);
	const [outlineWidth, setOutlineWidth] = useState([styles.weight]);
	const [fillColor, setFillColor] = useState(styles.fillColor);
	const [fillOpacity, setFillOpacity] = useState([styles.fillOpacity]);

	const [isCustom, setIsCustom] = useState(
		localStorage.getItem("useCustom") === "true" || false,
	);

	const handleSubmit = (e: any) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		const style = isCustom
			? {
					color: formData.get("outline-color"),
					weight: formData.get("outline-width"),
					fillColor: formData.get("fill-color"),
					fillOpacity: formData.get("fill-opacity"),
					radius: defaultStyles.radius,
				}
			: defaultStyles;
		formData.delete("outline-color");
		formData.delete("outline-width");
		formData.delete("fill-color");
		formData.delete("fill-opacity");

		formData.append("style", JSON.stringify(style));
		onSave(formData);
	};

	const handleStyles = () => {
		setIsCustom(!isCustom);
		localStorage.setItem("useCustom", !isCustom as any);
	};

	useEffect(() => {
		if (open && featureData) {
			console.log("Feature Data", featureData)
			setId(featureData.id || null);
			setName(featureData.name || "");
			setNotes(featureData.notes || "");
			setVisibility(featureData.visibility || "only-me");
			setOutlineColor(featureData.style?.color || styles.color);
			setOutlineWidth([featureData.style?.weight || styles.weight]);
			setFillColor(featureData.style?.fillColor || styles.fillColor);
			setFillOpacity([
				featureData.style?.fillOpacity || styles.fillOpacity,
			]);
		}
	}, [open, featureData]);

	useEffect(() => {
		if (!open) {
			setId(null);
			setName("");
			setNotes("");
			setVisibility("only-me");
			setOutlineColor(styles.color);
			setOutlineWidth([styles.weight]);
			setFillColor(styles.fillColor);
			setFillOpacity([styles.fillOpacity]);
		}
	}, [open]);

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
						<input
							type="hidden"
							name="id"
							value={id || undefined}
						/>
						<Field>
							<Label htmlFor="name">Name</Label>
							<Input
								id="name"
								name="name"
								required
								defaultValue={name}
							/>
						</Field>

						<Field>
							<Label htmlFor="username">Notes</Label>
							<Textarea
								id="notes"
								name="notes"
								defaultValue={notes}
							/>
						</Field>

							<Select name="visibility" defaultValue={visibility}>
								<SelectTrigger className="w-full">
									<SelectValue placeholder="Visibility" />
								</SelectTrigger>
								<SelectContent className="z-9999">
									<SelectGroup>
										{visibilityOptions.map((item: any) => (
											<SelectItem
												key={item.value}
												value={item.value}
											>
												{item.icon} {item.label}
											</SelectItem>
										))}
									</SelectGroup>
								</SelectContent>
							</Select>

						<div className="flex items-center space-x-2 mb-3">
							<Switch
								id="airplane-mode"
								checked={isCustom}
								onCheckedChange={handleStyles}
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
