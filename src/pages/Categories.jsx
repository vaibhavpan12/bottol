import Breadcrumbs from "../components/Breadcrumbs";
import FeaturedStrip from "../components/FeaturedStrip";
import usePageTitle from "../hooks/usePageTitle";

export default function Categories() {
  usePageTitle("All categories");
  return (
    <div className="page">
      <div className="wrap">
        <Breadcrumbs items={[{ label: "Categories" }]} />
      </div>
      <FeaturedStrip title="All categories" showAll />
    </div>
  );
}
