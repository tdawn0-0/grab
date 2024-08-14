import { useInfiniteQuery } from "@tanstack/react-query";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useEffect, useRef } from "react";
import { ClipCard } from "./clip-card";

const itemPerPage = 100;

export function VirtualList() {
	const { status, data, isFetchingNextPage, fetchNextPage, hasNextPage } = useInfiniteQuery({
		queryKey: ["history"],
		queryFn: async (ctx) => {
			const result = await window.api.getHistories({
				limit: itemPerPage,
				offset: itemPerPage * ctx.pageParam,
			});
			console.log(result);
			return result;
		},
		getNextPageParam: (lastPage, _, lastPageParam) =>
			lastPage.length === 100 ? lastPageParam + 1 : null,
		initialPageParam: 0,
		refetchOnWindowFocus: "always",
	});

	const allData = data ? data.pages.flat() : [];

	const parentRef = useRef<HTMLDivElement>(null);

	const columnVirtualizer = useVirtualizer({
		horizontal: true,
		count: hasNextPage ? allData.length + 1 : allData.length,
		getScrollElement: () => parentRef.current,
		estimateSize: () => 260,
		overscan: 5,
	});

	const renderItems = columnVirtualizer.getVirtualItems();

	useEffect(() => {
		const [lastItem] = [...renderItems].reverse();

		if (!lastItem) {
			return;
		}

		if (lastItem.index >= allData.length - 1 && hasNextPage && !isFetchingNextPage) {
			fetchNextPage();
		}
	}, [hasNextPage, fetchNextPage, allData.length, isFetchingNextPage, renderItems]);

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
				{status === "success" &&
					columnVirtualizer.getVirtualItems().map((virtualColumn) => {
						const isLoader = virtualColumn.index > allData.length - 1;
						const history = allData[virtualColumn.index];
						return (
							<ClipCard
								key={virtualColumn.index}
								style={{
									position: "absolute",
									top: 0,
									left: 0,
									transform: `translateX(${virtualColumn.start}px)`,
								}}
								content={isLoader ? "loading" : history.plainText ?? ""}
							/>
						);
					})}
			</div>
		</div>
	);
}
