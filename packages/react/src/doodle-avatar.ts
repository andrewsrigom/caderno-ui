'use client'

import { CadDoodleAvatar as CadDoodleAvatarElement } from '@caderno-ui/elements/doodle-avatar'
import { createComponent } from '@lit/react'
import React from 'react'

export const CadDoodleAvatar = createComponent({
  displayName: 'CadDoodleAvatar',
  elementClass: CadDoodleAvatarElement,
  react: React,
  tagName: 'cad-doodle-avatar',
})

export type {
  CadDoodleAvatarSize,
  CadDoodleAvatarVariant,
} from '@caderno-ui/elements/doodle-avatar'
