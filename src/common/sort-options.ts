/**
 * Sort Options
 */
export enum SortOptions {
  /**
   * By package rank
   */
  RANK = 'rank',

  /**
   * By package stars
   */
  STARS = 'stars',

  /**
   * By package Dependents Count
   */
  DEPENDENTS_COUNT = 'dependents_count',

  /**
   * By the count of dependent repos that depended on the package
   */
  DEPENDENT_REPOS_COUNT = 'dependent_repos_count',

  /**
   * By package latest release date
   */
  LATEST_RELEASE_PUBLISHED_AT = 'latest_release_published_at',

  /**
   * By the count of contributions to this package package
   */
  CONTRIBUTIONS_COUNT = 'contributions_count',

  /**
   * By package creation date
   */
  CREATED_AT = 'created_at'
}
