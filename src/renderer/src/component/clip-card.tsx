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
			className="group relative h-60 w-60 text-white/75 bg-black/30 dark:bg-neutral-800/15 shadow-md hover:outline-white/30 outline-white/15 outline-1 outline-offset-0"
			radius="md"
			onMouseMove={onMouseMove}
		>
			<LazyMotion features={domAnimation}>
				<m.div
					className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-250 group-hover:opacity-100"
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
			<CardBody className="px-6 pb-8 pt-4">
				<p className="dark:text-neutral-400 overflow-hidden break-words">{props.content}</p>
			</CardBody>
		</Card>
	);
}
