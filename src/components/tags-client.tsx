'use client'

import type { Tag } from '@/payload-types'
import {
  Badge,
  Box,
  Container,
  Heading,
  HStack,
  Input,
  SimpleGrid,
  Text,
  VStack,
} from '@chakra-ui/react'
import { useState } from 'react'

interface TagsClientProps {
  tags: Tag[]
}

export function TagsClient({ tags }: TagsClientProps) {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredTags = tags.filter((tag) =>
    tag.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <Container maxW="7xl" py={8}>
      <VStack gap={8} align="stretch">
        <Box textAlign="center">
          <Heading size="2xl" bgGradient="linear(to-r, blue.400, purple.500)" bgClip="text" mb={4}>
            Explore Tags
          </Heading>
          <Text fontSize="lg" color="gray.600" maxW="2xl" mx="auto">
            Discover topics and categories that organize our content
          </Text>
        </Box>

        <Box maxW="md" mx="auto" w="full">
          <Input
            placeholder="🔍 Search tags..."
            borderRadius="full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="lg"
          />
        </Box>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} gap={6}>
          {filteredTags.map((tag) => (
            <Box
              key={tag.id}
              p={6}
              borderWidth="1px"
              borderRadius="lg"
              cursor="pointer"
              transition="all 0.2s"
              _hover={{
                transform: 'translateY(-4px)',
                shadow: 'lg',
                borderColor: 'blue.400',
              }}
              bg={{ base: 'white', _dark: 'gray.800' }}
              borderColor={{ base: 'gray.200', _dark: 'gray.600' }}
            >
              <VStack align="start" gap={3}>
                <HStack justify="space-between" w="full">
                  <Badge colorScheme="blue" variant="subtle" px={2} py={1} borderRadius="full">
                    #{tag.name}
                  </Badge>
                </HStack>
              </VStack>
            </Box>
          ))}
        </SimpleGrid>

        {filteredTags.length === 0 && (
          <Box textAlign="center" py={12}>
            <Text fontSize="lg" color="gray.500">
              {searchTerm ? 'No tags found matching your search' : 'No tags found'}
            </Text>
          </Box>
        )}
      </VStack>
    </Container>
  )
}
