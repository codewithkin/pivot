import {motion, AnimatePresence} from "framer-motion";
import {useState, useEffect} from "react";

export default function Message({children,sender}) {
	const minutes = new Date().getMinutes().toString();

	return (
		<AnimatePresence>
			{sender  === "Babe" ? 
			<motion.article 
			initial={{
				x: -300
			}}
			animate={{
				x: 0
			}}
			className={`self-end w-[90%] md:w-[50%] px-4 mb-2 py-2 bg-pink-500 rounded-lg text-white`}>
				<p className="text-xs font-bold text-black">Babe</p>
				<p className="text-md text-wrap">
					{children}
				</p>
				<p
				className="self-end text-xs text-gray-600"
				>{new Date().getHours().toString()}:{minutes.length === 1 ? `0${minutes}` :
					minutes
				}</p>
			</motion.article> 
			:
						<motion.article 
			initial={{
				x: 300
			}}
			animate={{
				x: 0
			}}
			className={`px-4 w-[90%] md:w-[50%] mb-2 py-2 bg-blue-500 rounded-lg text-white`}>
				<p className="text-xs font-bold text-black">Me</p>
				<p className="text-md text-wrap">
					{children}
				</p>
				<p
				className="self-end text-xs text-gray-300"
				>{new Date().getHours().toString()}:{minutes.length === 1 ? `0${minutes}` :
					minutes
				}</p>
			</motion.article>
			}
		</AnimatePresence>
	)
}