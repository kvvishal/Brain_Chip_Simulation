import BrainCanvas from "../Brain/BrainCanvas";

export default function Dashboard() {

return (

<div className="grid grid-cols-12 gap-6">

<div className="col-span-8">

<BrainCanvas />

</div>

<div className="col-span-4">

<div className="bg-[#111827] rounded-xl h-[500px]">

Neural Chip Panel

</div>

</div>

<div className="col-span-6">

<div className="bg-[#111827] h-[350px] rounded-xl">

Brain Activity

</div>

</div>

<div className="col-span-6">

<div className="bg-[#111827] h-[350px] rounded-xl">

EEG

</div>

</div>

</div>

);

}