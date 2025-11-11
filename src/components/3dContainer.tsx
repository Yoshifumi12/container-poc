"use client";

import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Box, Text } from "@react-three/drei";
import { PlacedItem, Container } from "./types";

interface Container3DProps {
  container: Container;
  placedItems: PlacedItem[];
}

const Container3D: React.FC<Container3DProps> = ({
  container,
  placedItems,
}) => {
  return (
    <div className="w-full h-96 border rounded-lg">
      <Canvas camera={{ position: [10, 10, 10], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />

        <group position={[0, container.height / 2, 0]}>
          <Box args={[container.width, container.height, container.length]}>
            <meshStandardMaterial
              color="#ff0000"
              transparent
              opacity={1}
              wireframe
            />
          </Box>

          <Box
            args={[container.width, 0.05, 0.05]}
            position={[0, -container.height / 2, -container.length / 2]}
          >
            <meshStandardMaterial color="#333" />
          </Box>
          <Box
            args={[0.05, container.height, 0.05]}
            position={[-container.width / 2, 0, -container.length / 2]}
          >
            <meshStandardMaterial color="#333" />
          </Box>
        </group>

        {placedItems.map((item) => (
          <group
            key={item.id}
            position={[
              item.position[0] + item.width / 2 - container.width / 2,
              item.position[1] + item.height / 2,
              item.position[2] + item.length / 2 - container.length / 2,
            ]}
          >
            <Box args={[item.width, item.height, item.length]}>
              <meshStandardMaterial
                color={item.color}
                transparent
                opacity={0.8}
              />
            </Box>

            <Text
              position={[0, item.height / 2 + 0.1, 0]}
              fontSize={0.1}
              color="black"
              anchorX="center"
              anchorY="middle"
            >
              {item.name}
            </Text>
          </group>
        ))}

        <OrbitControls />
        <gridHelper args={[20, 20]} />
      </Canvas>
    </div>
  );
};

export default Container3D;
