import { useVirtualizer } from "@tanstack/react-virtual";
import { useRef } from "react";
import { ClipCard } from "./clip-card";

export function VirtualList() {
	const parentRef = useRef(null);

	const columnVirtualizer = useVirtualizer({
		horizontal: true,
		count: 10000,
		getScrollElement: () => parentRef.current,
		estimateSize: () => 260,
		overscan: 5,
	});

	return (
		<div ref={parentRef} className="h-60 w-full hide-scrollbar overflow-auto">
			<div
				className=""
				style={{
					width: `${columnVirtualizer.getTotalSize()}px`,
					height: "100%",
					position: "relative",
				}}
			>
				{columnVirtualizer.getVirtualItems().map((virtualColumn) => (
					<ClipCard
						key={virtualColumn.index}
						style={{
							position: "absolute",
							top: 0,
							left: 0,
							transform: `translateX(${virtualColumn.start}px)`,
						}}
					/>
				))}
			</div>
		</div>
	);
}
