<?php
/**
 * @author  wpWax
 * @since   6.6
 * @version 7.7.0
 */

use \Directorist\Directorist_Single_Listing;

if ( ! defined( 'ABSPATH' ) ) exit;

$listing = Directorist_Single_Listing::instance();
?>

<div class="directorist-single-listing-top directorist-flex directorist-align-center directorist-justify-content-between">
	<?php if( $listing->display_back_link() ): ?>

	<?php if ( $listing->current_user_is_author() ): ?>

		<?php if ( $listing->display_back_link() && ! $listing->has_redirect_link() && wp_get_referer() ): ?>

		<a href="<?php echo esc_url( wp_get_referer() ) ?>" class="directorist-return-back"><?php directorist_icon( 'las la-angle-left' ); ?> <?php esc_html_e( 'Go Back', 'directorist'); ?></a>

	<?php endif; ?>

	<div class="directorist-single-listing-quick-action directorist-flex directorist-align-center directorist-justify-content-between">

		<?php if ( $listing->submit_link() ): ?>
			<div class="directorist-single-listing-top__btn-wrapper">
				<a href="<?php echo esc_url( $listing->submit_link() ); ?>" class="directorist-single-listing-action directorist-btn directorist-btn-sm directorist-btn-light directorist-single-listing-top__btn-continue"><span class="directorist-single-listing-action__text"><?php esc_html_e( 'Continue to Publish', 'directorist' ); ?></span> </a>
			</div>
		<?php endif; ?>

		<a href="<?php echo esc_url( $listing->edit_link() ) ?>" class="directorist-single-listing-action directorist-btn directorist-btn-sm directorist-btn-light directorist-single-listing-top__btn-edit">
			<?php directorist_icon( 'las la-pen' ); ?>
			<span class="directorist-single-listing-action__text"><?php esc_html_e( 'Edit', 'directorist' ); ?></span>	
		</a>

		<?php $listing->quick_actions_template(); ?>

	</div>

	<?php elseif( $listing->display_back_link() && wp_get_referer() ): ?>

		<a href="<?php echo esc_url( wp_get_referer() ) ?>" class="directorist-return-back"><?php directorist_icon( 'las la-angle-left' ); ?> <?php esc_html_e( 'Go Back', 'directorist'); ?></a>

	<?php endif; ?>

</div>