export type FeatureCardProps = {
  title: string;
  description: string;
  icon: React.ComponentType<any>;
};

export const FeatureCard = ({
  icon: Component,
  title,
  description,
}: FeatureCardProps) => {
  return (
    <div className="bg-brand-800 p-6 rounded-xl">
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 bg-black/20 rounded-full flex items-center justify-center">
          <Component className="text-brand-300" strokeWidth={1.5} size={28} />
        </div>

        <h3 className="text-lg text-center font-semibold mt-4 mb-2 text-muted-light">
          {title}
        </h3>
        <p className="text-muted-dark text-sm text-center">{description}</p>
      </div>
    </div>
  );
};
