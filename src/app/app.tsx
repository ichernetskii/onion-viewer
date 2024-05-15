import {FC, useEffect, useRef, useState} from "react";
import styles from "./app.module.css";

const getImageURL = (image: File) => {
	return new Promise<string>((resolve, reject) => {
		if(image.type.startsWith("image/")) {
			const reader = new FileReader()
			reader.readAsDataURL(image)
			reader.onload = () => {
				if (typeof reader.result === "string") {
					resolve(reader.result);
				} else {
					reject();
				}
			}
		} else {
			reject();
		}
	})
}

export const App: FC = () => {
	const [mouseX, setMouseX] = useState(0);
	const [images, setImages] = useState<string[]>([]);
	const [imageRect, setImageRect] = useState<DOMRect | null>();
	const inputRef = useRef<HTMLInputElement>(null);
	const contentRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleResize = () => {
			const rect = contentRef.current?.getBoundingClientRect();
			setMouseX(x => x * (rect?.width || 1) / (imageRect?.width || 1));
			if (rect?.width !== imageRect?.width) {
				setImageRect(rect);
			}
		}
		handleResize();
		window.addEventListener("resize", handleResize);
		return () => {
			window.removeEventListener("resize", handleResize);
		}
	}, [images, mouseX, imageRect]);

	const isImagesLoaded = images[0] && images[1];

	return (
		<div
			className={styles.app}
			onDrop={async (e) => {
				const {files} = e.dataTransfer;
				if (files.length < 2) {
					return;
				} else {
					setImages([
						await getImageURL(files[0]),
						await getImageURL(files[1]),
					]);
				}
			}}
		>
			<input
				ref={inputRef}
				className={styles.hidden}
				type="file"
				accept="image/*"
				multiple={true}
				onChange={async (e) => {
					const files = e.target.files;
					if (files && files.length >= 2) {
						setImages([
							await getImageURL(files[0]),
							await getImageURL(files[1]),
						]);
					}
				}}
			/>
			<div className={styles.dropZone}>
				<div
					className={styles.dropZoneRect}
					onClick={() => inputRef.current?.click()}
				>
					{!isImagesLoaded && "Drop here"}
				</div>
			</div>
			<div
				className={styles.contentWrapper}
				style={{cursor: isImagesLoaded ? "col-resize" : "default"}}
			>
				<div
					ref={contentRef}
					className={styles.content}
					onPointerMove={e => {
						setMouseX(e.clientX - (imageRect?.x ?? 0));
					}}
					onClick={() => {
						setImages([images[1], images[0]]);
					}}
				>
					<img className={styles.image} src={images[0]} alt="" />
					{
						!!images.length && <div className={styles.verticalLine} style={{ left: mouseX }} />
					}
					<div
						className={styles.imageWrapper}
						style={{ width: mouseX }}
					>
						<img className={`${styles.image} ${styles.stretchVertical}`} src={images[1]} alt="" />
					</div>
				</div>
			</div>
		</div>
	);
}
