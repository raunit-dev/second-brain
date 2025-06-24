import { Logo } from "../icons/Logo";
import { TwitterIcon } from "../icons/TwitterIcon";
import { YoutubeIcon } from "../icons/YoutubeIcon";
import { Svbar } from "./Svbar";

export function Sidebar() {
    return (
        <div
            className="h-screen border-r w-72 fixed left-0 top-0 pl-6"
            style={{
                background: "linear-gradient(135deg, #a78bfa,rgb(19, 91, 133))" // fallback to hex values for better compatibility
            }}
        >
            <div className="flex text-2xl pt-8 items-center font-bold text-white">
                <div className="pr-2 text-purple-300">
                    <Logo />
                </div>
                Brainly
            </div>
            <div className="pt-8 pl-2">
                <Svbar text="Twitter" icon={<TwitterIcon />} />
                <Svbar text="Youtube" icon={<YoutubeIcon />} />
            </div>
        </div>
    );
}