import { Skeleton } from 'antd';

export const SkeletonNFT = () => {
  return (
    <Skeleton.Node
      active
      className="w-[100%!important] h-[370px!important] rounded-3xl overflow-hidden"
    >
      <div className="w-full px-0 flex flex-col items-start h-full">
        <Skeleton.Node
          active
          className="w-[100%!important] h-[300px!important]"
        >
          <></>
        </Skeleton.Node>
      </div>
    </Skeleton.Node>
  );
};
