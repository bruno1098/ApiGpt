import React from 'react';
import { useColorMode, Switch, Flex, IconButton } from '@chakra-ui/react';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';

export function ColorModeSwitcher() {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <Flex justify="flex-end" align="center" height="100%">
      <IconButton
        size="md"
        fontSize="lg"
        variant="ghost"
        color="current"
        marginLeft="2"
        onClick={toggleColorMode}
        icon={colorMode === "dark" ? <SunIcon /> : <MoonIcon />}
        aria-label={`Switch to ${colorMode === "dark" ? "light" : "dark"} mode`}
      />
    </Flex>
  );
}
