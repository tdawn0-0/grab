import type { CardProps } from "@nextui-org/react";
import { Card, CardBody } from "@nextui-org/react";
import { LazyMotion, domAnimation, m, useMotionTemplate, useMotionValue } from "framer-motion";
import React from "react";

export function ClipCard(props: CardProps & { content: string }) {
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
			className="group relative h-60 w-60 bg-black/30 text-white/80 shadow-md outline-1 outline-white/15 outline-offset-0 hover:outline-white/30 dark:bg-neutral-800/15"
			radius="md"
			onMouseMove={onMouseMove}
		>
			<LazyMotion features={domAnimation}>
				<m.div
					className="-inset-px pointer-events-none absolute rounded-xl opacity-0 transition duration-250 group-hover:opacity-100"
					style={{
						background: useMotionTemplate`
            radial-gradient(
              450px circle at ${mouseX}px ${mouseY}px,
              rgba(255, 255, 255, 0.2),
              transparent 80%
            )
          `,
					}}
				/>
			</LazyMotion>
			<CardBody className="p-6">
				<p className="overflow-hidden break-words dark:text-neutral-400">{props.content}</p>
			</CardBody>
		</Card>
	);
}
