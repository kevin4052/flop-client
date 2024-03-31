export default function Home() {
    return (
        <div className="w-full min-w-80 max-w-96 h-96 mx-auto border-indigo-900">
            <form className="mt-4">
                <div className="flex flex-col font-semibold text-lg mb-2">
                    <label className="mb-1 px-2">ROOM CODE</label>
                    <input
                        className="rounded-xl border-2 px-2 py-1"
                        placeholder="ENTER 4-LETTER CODE"
                        maxLength={4}
                        type="text"
                    ></input>
                </div>
                <div className="flex flex-col font-semibold text-lg">
                    <label className="mb-1 px-2">NAME</label>
                    <input
                        className="rounded-xl border-2 px-2 py-1 mb-2"
                        placeholder="ENTER YOUR NAME"
                        maxLength={12}
                        type="text"
                    ></input>
                </div>
                <div className="flex flex-row justify-center">
                    <button className="bg-slate-500 w-full mx-6 my-2 py-2 font-semibold text-lg rounded-xl">
                        PLAY
                    </button>
                </div>
            </form>
        </div>
    );
}
