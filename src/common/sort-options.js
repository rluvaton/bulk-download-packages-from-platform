
/**
 * @typedef {SortOptions.RANK|SortOptions.STARS|SortOptions.DEPENDENTS_COUNT|SortOptions.DEPENDENT_REPOS_COUNT|SortOptions.LATEST_RELEASE_PUBLISHED_AT|SortOptions.CONTRIBUTIONS_COUNT|SortOptions.CREATED_AT} SortOptions
 *
 * SortOptions.RANK - By package rank
 * SortOptions.STARS - By package stars
 * SortOptions.DEPENDENTS_COUNT - By package Dependents Count
 * SortOptions.DEPENDENT_REPOS_COUNT - By the count of dependent repos that depended on the package
 * SortOptions.LATEST_RELEASE_PUBLISHED_AT- By package latest release date
 * SortOptions.CONTRIBUTIONS_COUNT - By the count of contributions to this package package
 * SortOptions.CREATED_AT - By package creation date
 */

const SortOptions = {
    RANK: "rank",
    STARS: "stars",
    DEPENDENTS_COUNT: "dependents_count",
    DEPENDENT_REPOS_COUNT: "dependent_repos_count",
    LATEST_RELEASE_PUBLISHED_AT: "latest_release_published_at",
    CONTRIBUTIONS_COUNT: "contributions_count",
    CREATED_AT: "created_at"
};

module.exports = SortOptions;
