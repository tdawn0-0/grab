import { type CardProps, Chip } from "@nextui-org/react";
import { Card, CardBody } from "@nextui-org/react";
import { LazyMotion, domAnimation, m, useMotionTemplate, useMotionValue } from "framer-motion";
import React from "react";
import { useBearStore } from "../hook/use-bear-store";

export function ClipCard(props: CardProps & { content: string }) {
	const darkMode = useBearStore((state) => state.darkMode);
	const mouseX = useMotionValue(0);
	const mouseY = useMotionValue(0);

	const cardRef = React.useRef<HTMLDivElement>(null);

	function onMouseMove({ clientX, clientY }: React.MouseEvent<HTMLDivElement, MouseEvent>) {
		if (!cardRef?.current) return;

		const { left, top } = cardRef.current.getBoundingClientRect();

		mouseX.set(clientX - left);
		mouseY.set(clientY - top);
	}
	return (
		<Card
			{...props}
			ref={cardRef}
			className="group relative h-60 w-60 rounded-large border-1 border-white/20 bg-background/10 text-white/80 shadow-small backdrop-blur backdrop-saturate-150 before:rounded-xl before:bg-white/10 hover:border-white/40 hover:shadow-medium"
			radius="md"
			onMouseMove={onMouseMove}
		>
			<LazyMotion features={domAnimation}>
				<m.div
					className="-inset-px pointer-events-none absolute rounded-xl opacity-0 transition duration-250 group-hover:opacity-100"
					style={{
						background: darkMode
							? useMotionTemplate`
						radial-gradient(
              450px circle at ${mouseX}px ${mouseY}px,
              rgba(120, 40, 200, 0.2),
              transparent 80%
            )`
							: useMotionTemplate`
						radial-gradient(
              450px circle at ${mouseX}px ${mouseY}px,
              rgba(255, 255, 255, 0.2),
              transparent 80%
            )`,
					}}
				/>
			</LazyMotion>
			<CardBody className="p-6">
				<p className="overflow-hidden break-words dark:text-white/50">
					<div className="around-shape" />
					{props.content}
				</p>
			</CardBody>
			<Chip color="warning" variant="dot" className="absolute top-2 right-2">
				Dot
			</Chip>
		</Card>
	);
}
